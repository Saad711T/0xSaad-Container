    fetch("https://raw.githubusercontent.com/Saad711T/data-science-topics/main/README.md")
      .then(res => res.text())
      .then(text => {
        document.getElementById("readme").innerHTML = marked.parse(text);
      });