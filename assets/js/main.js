/*
  main.js limpio y compatible con jQuery para:
  - Menú responsive funcional
  - Animaciones iniciales
  - Banner dinámico
  - Scroll animado
  - Overlay de bienvenida (con sessionStorage)
*/

(function($) {
  var $window = $(window),
      $body = $('body'),
      $header = $('#header'),
      $banner = $('#banner');

  // Breakpoints.
  breakpoints({
    xlarge: '(max-width: 1680px)',
    large: '(max-width: 1280px)',
    medium: '(max-width: 980px)',
    small: '(max-width: 736px)',
    xsmall: '(max-width: 480px)'
  });

  // Animación inicial
  $window.on('load', function() {
    setTimeout(function() {
      $body.removeClass('is-preload');
    }, 1000);
  });

  // Header alterno con banner
  if ($banner.length > 0 && $header.hasClass('alt')) {
    $window.on('resize', function() { $window.trigger('scroll'); });

    $banner.scrollex({
      bottom: $header.outerHeight(),
      terminate: function() { $header.removeClass('alt'); },
      enter: function() { $header.addClass('alt'); },
      leave: function() { $header.removeClass('alt'); }
    });
  }

  // Menú responsive
  var $menu = $('#menu');

  $menu._locked = false;

  $menu._lock = function() {
    if ($menu._locked) return false;
    $menu._locked = true;
    setTimeout(function() { $menu._locked = false; }, 350);
    return true;
  };

  $menu._show = function() {
    if ($menu._lock()) $body.addClass('is-menu-visible');
  };

  $menu._hide = function() {
    if ($menu._lock()) $body.removeClass('is-menu-visible');
  };

  $menu._toggle = function() {
    if ($menu._lock()) $body.toggleClass('is-menu-visible');
  };

  $menu.appendTo($body)
    .on('click', function(event) {
      event.stopPropagation();
      $menu._hide();
    })
    .find('.inner')
      .on('click', '.close', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $menu._hide();
      })
      .on('click', function(event) {
        event.stopPropagation();
      })
      .on('click', 'a', function(event) {
        var href = $(this).attr('href');
        event.preventDefault();
        event.stopPropagation();
        $menu._hide();
        setTimeout(function() { window.location.href = href; }, 350);
      });

  $body.on('click', 'a[href="#menu"]', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $menu._toggle();
  });

  // Esc para cerrar menú
  $body.on('keydown', function(event) {
    if (event.keyCode == 27) $menu._hide();
  });

  // Overlay de bienvenida
  var $overlay = $('#welcomeOverlay');
  if ($overlay.length && !sessionStorage.getItem('saludoMostrado')) {
    $overlay.css({ transition: 'opacity 0.8s ease-out' });
    setTimeout(function() {
      $overlay.css({ opacity: '0', pointerEvents: 'none' });
      setTimeout(function() {
        $overlay.hide();
      }, 800);
    }, 2500);
    sessionStorage.setItem('saludoMostrado', true);
  } else {
    $overlay.hide();
  }

})(jQuery);
