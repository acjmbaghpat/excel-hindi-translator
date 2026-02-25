function transliterate(text) {
  const map = {
    a:"अ", aa:"आ", i:"इ", ee:"ई", u:"उ", oo:"ऊ",
    k:"क", kh:"ख", g:"ग", ch:"च", j:"ज",
    t:"त", d:"द", n:"न", p:"प", b:"ब", m:"म",
    y:"य", r:"र", l:"ल", v:"व", s:"स", h:"ह"
  };

  return text.split(" ").map(word => {
    let result = "";
    let i = 0;
    word = word.toLowerCase();

    while (i < word.length) {
      if (map[word.substring(i, i+2)]) {
        result += map[word.substring(i, i+2)];
        i += 2;
      } else if (map[word[i]]) {
        result += map[word[i]];
        i++;
      } else {
        result += word[i];
        i++;
      }
    }
    return result;
  }).join(" ");
}

function convert() {
  const input = document.getElementById("file");
  if (!input.files.length) {
    alert("Excel select karo");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const wb = XLSX.read(e.target.result, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(ws);

    data.forEach(row => {
      if (row["Party Name"]) {
        row["Party Name"] = transliterate(row["Party Name"]);
      }
    });

    const newWs = XLSX.utils.json_to_sheet(data);
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, newWs, "Hindi");

    XLSX.writeFile(newWb, "PartyName_Hindi.xlsx");
  };

  reader.readAsArrayBuffer(input.files[0]);
}
