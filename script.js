async function translateToHindi(text) {
  if (!text) return text;

  const url =
    "https://cors.isomorphic-git.org/https://translate.googleapis.com/translate_a/single" +
    "?client=gtx&sl=en&tl=hi&dt=t&q=" +
    encodeURIComponent(text);

  const response = await fetch(url);
  const result = await response.json();
  return result[0][0][0];
}

async function processExcel() {
  const fileInput = document.getElementById("upload");
  if (!fileInput.files.length) {
    alert("Excel file select karo");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let data = XLSX.utils.sheet_to_json(sheet);

    // ✅ sequential translate (important)
    for (let i = 0; i < data.length; i++) {
      if (data[i]["Party Name"]) {
        data[i]["Party Name"] =
          await translateToHindi(data[i]["Party Name"]);
      }
    }

    const newSheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      newWorkbook,
      newSheet,
      "Translated"
    );

    XLSX.writeFile(newWorkbook, "Translated_Party_Name.xlsx");
  };

  reader.readAsBinaryString(fileInput.files[0]);
}
