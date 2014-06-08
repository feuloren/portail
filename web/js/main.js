$(document).ready(function(){
  $("#lienlisteassos").click(function(e){
    e.preventDefault();
    $("#bigmenu").toggle();
  });
  
  $("body").click(function(e){
    if(!$(e.target).is("#bigmenu") && $(e.target).parents("#bigmenu").length == 0 && !$(e.target).is("#lienlisteassos"))
      $("#bigmenu:visible").hide();
  });

  $("#all_but").click(function(e){
    e.preventDefault();
    $("#all_but").css("border-bottom", "3px solid black");
    $("#articles_but").css("border-bottom", "none");
    $("#events_but").css("border-bottom", "none");
    
    $("#my_flux div.articles_abonnements").show();
    $("#my_flux div.events_abonnements").show();
  });
  
  $("#articles_but").click(function(e){
    e.preventDefault();
    $("#all_but").css("border-bottom", "none");
    $("#articles_but").css("border-bottom", "3px solid black");
    $("#events_but").css("border-bottom", "none");
    
    $("#my_flux div.articles_abonnements").show();
    $("#my_flux div.events_abonnements").hide();
  });
  
  $("#events_but").click(function(e){
    e.preventDefault();
    $("#all_but").css("border-bottom", "none");
    $("#articles_but").css("border-bottom", "none");
    $("#events_but").css("border-bottom", "3px solid black");
    
    $("#my_flux div.articles_abonnements").hide();
    $("#my_flux div.events_abonnements").show();
  });

   $(".well").tooltip({
     selector: "a[rel=tooltip]"
   });
    
  $('.dropdown-toggle').dropdown();
  
  if ($.fn.datetimepicker) {
    $('.datepicker').datetimepicker({
      dateFormat: "dd/mm/yy",
      timeFormat: "HH:mm"
    });
  }
  
  $(".ejs").each(function(){
    var a = $(this).html() + "@assos.utc." + "fr";
    $(this).html(a);
    $(this).attr("href", "mailto:" + a);
    $(this).css("visibility", "visible");
  });
  
  $("img.avatar").error(function() {
    if($(this).attr("src") != "/images/default.jpg"){
      $(this).attr("src", "/images/default.jpg");
    }
  });

  if(window.Select2)
    $(".select2").select2({width: 'resolve'});

  var searchServices = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: [{name : "Gestion des mails assos",
                   url : '/gesmail'},
                  {name : "Webmail asso",
                   url : '/mail'},
                  {name : "Outils trésorerie",
                   url : '/treso.php'},
                  {name : "Wiki des assos",
                   url : '/wiki'}]
  });
  searchServices.initialize();

  var getSourceFor = function(remote) {
    var search = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: remote
    });
    search.initialize();
    return search.ttAdapter();
  };

  $("#search-box").typeahead({
      minLength: 3,
      autoselect: true
   },
    [{name: 'assos',
      source: getSourceFor('/search/asso.json?query=%QUERY*'),
      displayKey: 'name',
      templates : {
        header: '<ul><li class="nav-header" style="margin-top: 0px;">Assos</li>',
        suggestion: function(res) {
            return '<li>' + res.name + '</li>'
        },
        footer: '</ul>'
      }
    },
    {name: 'events',
      source: getSourceFor('/search/event.json?query=%QUERY*'),
      displayKey: 'name',
      templates : {
        header: '<ul><li class="nav-header" style="margin-top: 0px;">Évènements</li>',
        suggestion: function(res) {
            return '<li>' + res.name + ' par ' + res.asso + '</li>';
        },
        footer: '</ul>'
      }
    },
    {name: 'articles',
      source: getSourceFor('/search/article.json?query=%QUERY*'),
      displayKey: 'name',
      templates : {
        header: '<ul><li class="nav-header" style="margin-top: 0px;">Articles</li>',
        suggestion: function(res) {
            return '<li>' + res.name + ' par ' + res.asso + '</li>';
        },
        footer: '</ul>'
      }
    },
    {name: 'services',
     source: searchServices.ttAdapter(),
     displayKey: 'name',
     templates : {
       header: '<ul><li class="nav-header" style="margin-top: 0px;">Services</li>',
       suggestion: function(res) {
            return '<li>' + res.name + '</li>'
       },
       footer: '</ul>'
     }
    },
    ]).on('typeahead:selected', function(event, res, set) {
        window.location.replace(res.url);
   });
  
  $("#asearch-box").keyup(function(key)
    {
      if (this.value.length >= 3)
      {
        $("#search-results").html("<em>Loading...</em>");
        $("#search-results").show();
        $("#search-results").load(
          $(this).parents('form').attr('action'),
          { query: $(this).val() + '*' },
          function() { $('#loader').hide(); }
        );
      }
      else {
          $("#search-results").hide();
      }
    });
});
