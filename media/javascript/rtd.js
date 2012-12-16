(function () {
  var checkVersion = function (slug, version) {
    var versionURL = ["//readthedocs.org/api/v1/version/", slug,
                      "/highest/", version, "/?callback=?"].join("");

    $.getJSON(versionURL, onData);

    function onData (data) {
      if (data.is_highest) {
        return;
      }

      var currentURL = window.location.pathname.replace(version, data.slug),
          warning = $('<div class="admonition note"> <p class="first \
                       admonition-title">Note</p> <p class="last"> \
                       You are not using the most up to date version \
                       of the library. <a href="#"></a> is the newest version.</p>\
                       </div>');

      warning
        .find('a')
        .attr('href', currentURL)
        .text(data.version);

      $("div.body").prepend(warning);
    }

  };

  var getVersions = function (slug, version) {
    var versionsURL = ["//readthedocs.org/api/v1/version/", slug,
                       "/?active=True&callback=?"].join("");

    return $.getJSON(versionsURL, gotData);

    function gotData (data) {
      var items = $('<ul />')
        , currentURL
        , versionItem
        , object

      for (var key in data.objects) {
        object = data.objects[key]
        currentURL = window.location.pathname.replace(version, object.slug)
        versionItem = $('<a href="#"></a>')
          .attr('href', currentURL)
          .text(object.slug)
          .appendTo($('<li />').appendTo(items))
      }

      // update widget and sidebar
      $('#version_menu, .version-listing, #sidebar_versions').html(items.html())
    }
  };

  var getMoreLikeThis = function (slug, filename) {
    var URL = ["//readthedocs.org/mlt/", slug, "/", filename, "?callback=?"].join("");

    return $.getJSON(URL, gotDataMLT);

    function gotDataMLT (data) {
      var items = $('<ul />')
        , object

      for (var num in data) {
        obj = data[num]
        title = obj[0]
        url = obj[1]
        console.log(obj)
        console.log(title)
        console.log(url)
        Item = $('<a href="#"></a>')
          .attr('href', url)
          .text(title)
          .appendTo($('<li />').appendTo(items))
      }

      // update widget and sidebar
      $('.sphinxsidebarwrapper').append(items.html())
    }
  };

  $(function () {
    var slug = window.doc_slug,
        version = window.doc_version;

    // Show action on hover
    $(".module-item-menu").hover(
      function () {
        $(".hidden-child", this).show();
      }, function () {
        $(".hidden-child", this).hide();
      }
    );

    checkVersion(slug, version);
    getVersions(slug, version);
    // doc_filename comes from the Sphinx built, and is in the page before this
    // file is included
    getMoreLikeThis(slug, doc_filename)
  });

})();
