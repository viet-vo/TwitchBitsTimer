console.log("loaded");

document.addEventListener("click", (e) => {
  if (e.target.tagName == "button") {
    e.preventDefault();
    window.electron.openWeb(e.target.getAttribute("href"));
  }
});
document.getElementById("open-in-browser").addEventListener("click", () => {
  window.shell.open();
});

// Display response object in table form
// window.electron.onTwitchUser(user => {
// 	let table = document.getElementById('user');
// 	table.textContent = '';

//     for (var key in user) {
//         var tr = document.createElement('tr');
//         table.append(tr);
//         var td = document.createElement('td');
//         td.textContent = key;
//         tr.append(td);
//         var td = document.createElement('td');
//         td.textContent = user[key];
//         tr.append(td);
//     }
// });
