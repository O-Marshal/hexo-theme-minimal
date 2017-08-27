//<![CDATA[
        $(window).on('load', function() { // makes sure the whole site is loaded
            $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
            $('body').delay(350).css({'overflow':'visible'});
        })
//]]>