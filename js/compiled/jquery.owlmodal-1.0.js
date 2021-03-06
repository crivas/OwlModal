/*!
 * pluginName: OwlModal
 * author: Chester Rivas
 * website: crivas.net
 * description: modal jquery plugin, includes built-in lightbox
 * version: 1.0
 * Copyright (c) 2014 Crivas Inc.
 */

var Owl = Owl || {};

Owl.event = Owl.event || {};
Owl.event.OPENMODALCLICKED = "openmodalclicked";
Owl.event.CLOSEMODALCLICKED = "closemodalclicked";
Owl.event.OPENMODALSTARTED = "openmodalstarted";
Owl.event.OPENMODALCOMPLETE = "openmodalcomplete";
Owl.event.CLOSEMODALSTARTED = "closemodalstarted";
Owl.event.CLOSEMODALCOMPLETE = "closemodalcomplete";

$.fn.owlmodal = function(options) {

    var settings = $.extend({
        // These are the defaults.
        modalWidth: 600,
        modalHeight: 500,
        lightBoxOn: true,
        clickAnywhereToClose: false,
        animationSpeed: .6,
        showCloseButton: true,
        revealElements: [],
        hideElements: []
    }, options);

    var $this = this,
        modalWidth = settings.modalWidth,
        modalHeight = settings.modalHeight,
        lightBoxOn = settings.lightBoxOn,
        owlModalClassName = 'owl-modal',
        $clonedTarget,
        $closeButton,
        $lightBox,
        $modal;

    /**
     init plugin

     @method initModal
     **/
    $this.initModal = function() {

        var i;

        for ( i = 0; i < settings.revealElements.length; i++ ) {
            $(settings.revealElements[i]).on('click', function(){
	            $this.openModal();
            });
        }

        for ( i = 0; i < settings.hideElements.length; i++ ) {
            $(settings.hideElements[i]).on('click', function(){
	            $this.closeModal();
            });
        }

        if (lightBoxOn && !$('#lightbox').length > 0) {
            $('body').append("<div id='lightbox'></div>");
            $lightBox = $('#lightbox');
            $lightBox .css({
                display: 'none',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                position: 'fixed',
                backgroundColor: 'rgba(0,0,0,.5)',
                width: '100%',
                height: '100%',
                zIndex: 998,
                opacity: 0
            });
        } else {
            $lightBox = $('#lightbox');
        }

        if (!$('#owlmodal-target').length > 0) {
            $('body').append("<div id='owlmodal-target'></div>");
        }

    };

    $this.cloneTarget = function() {

        $clonedTarget = $clonedTarget || $this.clone();

        $('#owlmodal-target').append($clonedTarget);
        $modal = $('#owlmodal-target');
        $modal.css({
            position: 'fixed',
            display: 'block',
            opacity: 0,
            zIndex: 998,
            width: modalWidth,
            height: modalHeight,
            margin: -( modalHeight / 2 ) + 'px 0 0' + -( modalWidth / 2 ) + 'px',
            left: '-500%',
            top: '50%'
        });
        $clonedTarget.addClass(owlModalClassName);

        if (settings.showCloseButton && !$('.close-button').length > 0) {
            $clonedTarget.append("<div class='close-button'></div>");
            $closeButton = $('.close-button');
            $closeButton.css({
                zIndex: 999
            });
        }

        $closeButton.on('click', $this.closeModal);

    };

	$this.openModal = function() {

        $this.cloneTarget();

        $this.trigger(Owl.event.OPENMODALCLICKED);
        $this.trigger(Owl.event.OPENMODALSTARTED);

        $modal.css({
            left: '50%',
            display: 'block'
        });

        $lightBox.css({
            display: 'block'
        });

        TweenLite.to($modal, settings.animationSpeed, {
            autoAlpha: 1, ease: 'Strong.easeOut', onComplete: $this.onOpenModalComplete
        });

        TweenLite.to($lightBox, settings.animationSpeed, {
            autoAlpha: 1, ease: 'Strong.easeOut'
        });

    };

	$this.closeModal = function() {

        $this.trigger(Owl.event.CLOSEMODALCLICKED);
		$this.trigger(Owl.event.CLOSEMODALSTARTED);

        TweenLite.to($modal, settings.animationSpeed, {
            autoAlpha: 0, ease: 'Strong.easeOut', onComplete: $this.onCloseModalComplete
        });

        TweenLite.to($lightBox, settings.animationSpeed, {
            autoAlpha: 0, ease: 'Strong.easeOut'
        });

        if (settings.clickAnywhereToClose) {
            $('body').off('click');
        }

    };

	$this.onOpenModalComplete = function() {
        $this.trigger(Owl.event.OPENMODALCOMPLETE);
        if (settings.clickAnywhereToClose) {
            $('body').on('click', $this.closeModal);
        }
    };

	$this.onCloseModalComplete = function() {
        $this.trigger(Owl.event.CLOSEMODALCOMPLETE);
        $clonedTarget.remove();
    };

	$this.initModal();

};