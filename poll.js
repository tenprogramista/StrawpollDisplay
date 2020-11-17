let fields, url;

window.addEventListener('onWidgetLoad', (obj) => {
    fields = obj.detail.fieldData;
      
    setInterval(refreshScores, fields.refreshDelay * 1000);
  
  	url = `https://www.strawpoll.me/api/v2/polls/${fields.pollId}`;
  
    refreshScores();
});

function refreshScores() {
    $.getJSON(url, (data) => {
        var question = fields.overwriteQuestion ? fields.question : data["title"];
        var votes = sortData(
          extractData(data, "options", "votes")
        );
      
          $('#question').html(question);
          $('#bars').html("");

        var total = 0;

        for (var el in votes) 
        {
            total += parseInt(votes[el]);
        }
        
        var i = 0;
        for(var key in votes) 
        {
            if(i >= fields.topAnswers) break;
            var percent = ((votes[key] / total) * 100).toFixed(2);
            $('#bars').append(`<div class="section"><div class="bar" style="width: ${percent}%"></div><span class="left">${key}</span><span class="right">${percent}%</span></div>`);
            i++;
        }
    });
}

function extractData(data, keys, values) {
    
    var k = data[keys];
    var v = data[values];
    
    var obj = {};

    for(var i = 0; i < k.length; i++) {
        obj[k[i]] = v[i]; 
    }

    return obj;
}

function sortData(data) {
    var sorted = Object.entries(data)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    return sorted;
}