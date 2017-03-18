# One technique for forcing HTTPS in Elastic Beanstalk

tl;dr -> Inspect headers passed by ELB to redirect to https protocol.

<br>
Recently I have been "re-kicking" the tires on [AppEngine](https://cloud.google.com/appengine/)  and [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) to see how the products are maturing.  As everyone knows, making your http service/site use ssl/tls is mandatory these days. In AppEngine it is fairly trivial to enforce HTTPS, however in Elastic Beanstalk there is no "easy button".  Sure you can listen on 443 with a cert in place, but when you turn off 80 your users will get a connect error.  Not a great experience.  

There are a few approaches that involve .ebextensions and nginx rules, but none of those approaches are straightforward.  The approach I settled on was to try and do a redirect to https in code. The magic bean turns out be the "X-Forwarded-Proto" header that the ELB passes you, without that nugget this approach would not work.

Ok, let's get into the details.

So, you have an app working in Elastic Beanstalk.  AWESOME!  Let's configure https and force the users to use that protocol. First we need to do some pre-work.  I will assume your app is already running under a domain you control.  But we need to secure a cert.  Luckily Amazon makes this DEAD SIMPLE with [ACM](https://aws.amazon.com/certificate-manager/).  In the same account your beanstalk app is running in, secure a cert in ACM for the domain you are using.  Now we need to configure the network/load balancing tier to use this cert.  Go to the configuration page for your EB environment, scroll to the bottom and choose Network Tier / Load balancing.  Turn on https:

<br>
![diagram](/assets/images/force-https/eb-config.png)
<br>
<br>

Ok, so far so good.  Your app is listening on 80 and 443 and we have a cert in place so we get a green dot when we browse to our https endpoint.  But...users can still hit your site over 80.  Not good.  Resist the tempation to just turn the unsecured protocol off.  We need to put something in place to redirect to https.  Because EB is a standard AWS offering it uses ELB's to proxy and distribute traffic to your compute layer.  When we turned on https the ELB layer actually uses that cert and terminates ssl at that layer.  Then unsecured traffic flows into your instances.  This approach is referred to as [Layer 7](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-listener-config.html). Luckily for us, when the ELB does that is adds a header to the request that lets us know what the orginiating protocol was.  This header is "X-Forwarded-Proto".  If we see that header and the value is "http" we know that we need to redirect to https.

In our middleware chain, we make sure that all routes force https:

```
func NewRouter() *mux.Router {

	router := mux.NewRouter().StrictSlash(true)

	for _, route := range routes {

		var handler http.Handler

		handler = route.HandlerFunc
		handler = ForceHTTPS(Logger(handler, route.Name))

		router.Methods(route.Method).Path(route.Pattern).Name(route.Name).Handler(handler)

	}

	return router
}

```


and in the code for forceHTTPS we do a 302 redirect to the https endpoint:

```

func ForceHTTPS(h http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.Header.Get("X-Forwarded-Proto") == "http" {

			http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)

		}

		h.ServeHTTP(w, r)

	})
}

```

<br>
<br>

Questions, comments?  Reach out to me in the [Cloud Strategy](https://cloudstrategy.slack.com) slack room.






