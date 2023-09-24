
self.addEventListener('message', (e) => {
    const rows = e.data.trs;
    const rowData = [];

    function getSelectedText(el) {
        let selectedIndex = el.selectedIndex;
        let selectedText = el.options[selectedIndex].text;
        return selectedText
    }
  
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const cellData = [];
  
      cells.forEach((cell) => {
        cellData.push(getSelectedText(cell.find('select')[0]) );
      });
  
      rowData.push(cellData);
    });
  
    self.postMessage(rowData);
  });
  