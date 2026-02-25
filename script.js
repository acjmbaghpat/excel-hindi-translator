
async function translateToHindi(text) {
  let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
  let res = await fetch(url);
  let data = await res.json();
  return data[0][0][0];
}

async function processExcel() {
  const file = document.getElementById("upload").files[0];
  if (!file) {
    alert("Excel file select karo");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let data = XLSX.utils.sheet_to_json(sheet);

    for (let row of data) {
      if (row["Party Name"]) {
        row["Party Name"] = await translateToHindi(row["Party Name"]);
      }
    }

    const newSheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Translated");

    XLSX.writeFile(newWorkbook, "Party_Name_Hindi.xlsx");
  };

  reader.readAsBinaryString(file);
}
