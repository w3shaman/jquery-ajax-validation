/**
 * jQuery Plugin for adding server validation feature to Ajax Form plugin
 * @version 1.1
 * @requires jQuery 1.4 or later and jQuery Form Plugin (http://malsup.com/jquery/form/)
 *
 * Copyright (c) 2016 Lucky <bogeyman2007@gmail.com>
 * Licensed under the GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {
  function relocateLoader(divId) {
    $("#" + divId).css({
      "display":"block",
      "position":"absolute",
      "top":$(document).scrollTop() + "px",
      "left":(($(window).width()- $("#" + divId).width())/2)+$(document).scrollLeft() + "px",
      "opacity":0.8
    });
  }

  function showLoader(divId, loadingMessage) {
    $("#" + divId).html(loadingMessage);

    relocateLoader(divId);

    $(window).scroll(function() {
      relocateLoader(divId);
    });
  }

  function hideLoader(divId) {
    $("#" + divId).hide();

    $(window).scroll(function() {
      $("#" + divId).hide();
    });
  }

  function showMessage(div, message) {
    $("#" + div).html(message);

    $("#" + div).fadeIn("fast", function () {
      hideMessage(div);
    });
  }

  function hideMessage(div) {
    clearTimeout($.fn.ajaxvalidation.messageTimeOut);
    $.fn.ajaxvalidation.messageTimeOut=setTimeout('$("#' + div + '").fadeOut("fast")',10000);
  }

  $.fn.ajaxvalidation = function (opts) {
    var options = {
      messageDivId : "message",
      waitingDivId : "waiting",
      loadingMessage : "Loading...",
      errorChar: "*",
      onComplete: null,
      onError: null,
      selector: "name"
    };
    $.extend(options, opts);

    if (options.waitingDivId != null && options.waitingDivId != "") {
      $("body").append('<div id="' + options.waitingDivId + '"></div>');
      hideLoader(options.waitingDivId);
    }

    this.each(function() {
      var form=$(this);

      form.submit(function() {
        showLoader(options.waitingDivId, options.loadingMessage);
      });

      form.ajaxForm({
        success: function(data) {
          hideLoader(options.waitingDivId);

          try {
            var arr=null;
            if (typeof data == 'string')
              arr=$.parseJSON(data);
            else if (typeof data == 'object')
              arr=data;

            if (arr != null) {
              if (arr.clearForm==true) {
                form.clearForm();
              }

              var upload = $("input:file");
              if (typeof upload.MultiFile === "function") {
                if (upload.length > 0) {
                  upload.MultiFile('reset');
                }
              }

              $(".error-field-char").remove();
              $("input, select, textarea").removeClass('error-field-background');
              if (arr.errorFields != null) {
                for (var i in arr.errorFields) {
                  errorMessage = options.errorChar.replace("[field-message]", arr.errorFields[i]);

                  $("input[" + options.selector + "='" + i + "'], select[" + options.selector + "='" + i + "'], textarea[" + options.selector + "='" + i + "']").after('<span class="error-field-char">' + errorMessage + '</span>');
                  $("input[" + options.selector + "='" + i + "'], select[" + options.selector + "='" + i + "'], textarea[" + options.selector + "='" + i + "']").addClass('error-field-background');
                }
              }

              showMessage(options.messageDivId, '<div class="' + arr.status + '">' + arr.message + '</div>');

              if (options.onComplete != null) {
                options.onComplete.call(this, arr);
              }
            }
          }
          catch(e) {
            showMessage(options.messageDivId, '<div class="failed">Oops... An error has occured!!</div>');

            if (options.onComplete != null) {
              options.onComplete.call(arr);
            }
          }
        },
        error: function(xhr, status, ex) {
          var upload = $("input:file");
          if (typeof upload.MultiFile === "function") {
            if (upload.length > 0) {
              upload.MultiFile('reset');
            }
          }

          hideLoader(options.waitingDivId);

          showMessage(options.messageDivId, '<div class="failed">Oops... An error has occured!</div>');

          if(options.onError != null) {
            options.onError.call(xhr);
          }
        }
      });
    });
  }

  $.fn.ajaxvalidation.messageTimeOut;
})(jQuery);
