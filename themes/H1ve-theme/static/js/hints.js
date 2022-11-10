function hint(id) {
  return CTFd.fetch("/api/v1/hints/" + id, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(function(response) {
    return response.json();
  });
}

function unlock(params) {
  return CTFd.fetch("/api/v1/unlocks", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  }).then(function(response) {
    return response.json();
  });
}

function loadhint(hintid) {
  var md = window.markdownit({
    html: true,
    linkify: true
  });

  hint(hintid).then(function(response) {
    if (response.data.content) {
      ezal({
        title: "提示",
        body: md.render(response.data.content),
        button: "确定"
      });
    } else {
      ezq({
        title: "解锁提示?",
        body: "是否确实要打开此提示？?",
        success: function() {
          var params = {
            target: hintid,
            type: "hints"
          };
          unlock(params).then(function(response) {
            if (response.success) {
              hint(hintid).then(function(response) {
                ezal({
                  title: "提示",
                  body: md.render(response.data.content),
                  button: "确定"
                });
              });
            } else {
              ezal({
                title: "错误",
                body: md.render(response.errors.score),
                button: "确定"
              });
            }
          });
        }
      });
    }
  });
}
