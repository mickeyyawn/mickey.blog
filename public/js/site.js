


        /* Open */
        function openNav() {

            document.cookie = "viewedMenu=true";
            $('#hamburger-container').tooltip('hide');


            var hamburger = document.getElementById("hamburger-container");
            var menuCloseButton = document.getElementById("menu-close-button");
            var navOverlay = document.getElementById("myNav");


            var rect = hamburger.getBoundingClientRect();

            menuCloseButton.style.top = rect.top +'px';
            menuCloseButton.style.left = rect.left +'px';
            navOverlay.style.height = "100%";

            }

        /* Close */
        function closeNav() {
            document.getElementById("myNav").style.height = "0%";
        }

        $(function () {

            console.log('checking cookier');

            console.log(document.cookie);
            console.log(!document.cookie);
            console.log(document.cookie.viewedMenu == 'true');


            if(!document.cookie.viewedMenu){

                var options = {};
                options.title = 'Click menu for options';
                options.placement = 'left';
                options.trigger = 'manual';
        

                $('#hamburger-container').tooltip(options);
                $('#hamburger-container').tooltip('show');

                setTimeout(function(){ $('#hamburger-container').tooltip('dispose'); }, 3000);
            }
 



        })
