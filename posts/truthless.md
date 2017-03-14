TRUTHLESS


<script type="application/json" id="metadata">
    {
        "title": "my awesome little post!"
        "tags": [1, 2, 3]
    }
</script>


WHY did Serverless become so popular so quickly?  When you look at the timeline
it took off quicker than containers did.  Why?  Becasue it was easy to get
going right out of the box.  Containers have only gotten "easy" to run
in production recently.

But...

"Serverless" is a sham rolled up in a ball of half truths.

Some of the cornerstones of serverless:

- No servers to manage
- Reduced costs.  Only pay for what you use!
- No ops.  Just deploy and it magically runs!
- No docker!  You just write code, don't worry about containers.


Well, those are mostly true, at least from the outside looking in.
It was actually a brilliant marketing move by Amazon.  They saw a segment
of the dev community that struggled with operating their stack and
introduced Lambda to scratch that itch.  

Some companies/teams have taken it to the nth degree, and run their
ENTIRE stack in Lambda/API Gateway.

Lets touch on some of the half truths.

1) No servers to manage.  True, you never have to worry about bootstrapping
a box, ssh'ing into it, keeping ami's rev'ed, installing docker, or
installing ANYTHING.  Ahhhh bliss.  But what is lost on people is there
IS an actual server with an honest to god CPU running your "hello world" func.
And there are ACTUAL humans operating that fleet of servers sitting behind Lambda.  
2) Reduced costs.  Absolutely, another brilliant marketing move.  You pay
for hits and run time.  Very cool.  So when your geo-location service
is sitting idle for 18 hours a day because an NBA game is not on, you don't
pay for it.  WOOO HOOO!  What you don't realize is that code is still running
in a container somewhere, just not receiving traffic or processing anything.
So Amazon is internally paying for it, but hiding those costs from you.
3) No ops.  Yep.  Not many knobs to turn.  No server to maintain. Nothing to monitor. But there is a team behind the service.  Keeping it running.  Day in, day out.
4) No docker. Yep, to the outside consumer no docker knowledge is required.
But more than likely there is a container orchestration engine that is providing isolation, resiliency, and a runtime for your function to sit in.


The REAL power of Lambda is not the API Gateway abstraction.  Any node.js/golang/php dev can define routes in code and return http codes and json.
The REAL power is the extreme abstraction that Lambda gives you.  You just...write...code...PERIOD.  A lot of dev teams walk around with a
cloud of FUD hanging over them.  "You wrote it.  You run it." is not
a statement that gives them warm fuzzies.  They just want to solve business
requirements and do the minimal required to get it running in production.
I get it.  I totally do.

The funny thing is that the very cornerstone of Harbor was serverless before serverless existed.  The requirement from the business was "I have this node.js repo and I just want you to run it for me in production.". "I don't want to know about Docker.  I don't want to know how it scales.  I don't want to know how the servers are maintained.  I don't want to know what orchestration engine you are using. I don't want to get a bill".

Wow, sounds a lot like "Serverless"!

So what if we created a new product?  A product that rolled the clock back
to that original requirement, but made it simpler, cheaper, and even easier
for devs to work with?

What if this product was extremely opionated?  No Dockerfile or Containers from the outside.  We take a golang repo or node.js repo, and instantly run it in production.  Like in less than 10 seconds you have a production endpoint? No ELB's. everything gets routed through backplane.  No certs to manage, backplane handles those for you.
Take the best things from Nodejitsu, Heroku, Lambda, and Harbor (buildit) and
roll that into a new product offering....Called...

FAASION.IO

Completely disconnected from Turner's datacenter.
Public internet ONLY.
Only HTTPS.  
Only HTTP/2.
Only listen on 443.
Required healthcheck of /hc  (or we fail your deployment).
Only node.js or golang.
Built in monitoring.
Built in stats.
Built in logging.
Built in Blue/Green.
Built in multi-region.
Secrets definined in a diff system?  Runtime discovery?  Layer around Vault, no env vars?
Websockets would need to work "out of the box".
Replicas > 1 ONLY.  (Concurrent, distributed, auto-scaled)
CLI only.
No Firewall IP rules to hide behind.
Ingress/balancing layer simplified. (backplane?? alb's??)
Containers...yes.  But maybe not kubernetes?
One or two big clusters max.  No "cluster per account"...
