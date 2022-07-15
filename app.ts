const images = [
  "boba", "american-football-ball", "card-ace-spades", "crossbow", "donkey", 
  "flame", "gladius", "gold-bar", "holy-oak", "minerals", 
  "ninja-heroic-stance", "pistol-gun", "ram", "round-shield", "shirt", 
  "shuriken", "spider-alt", "violin", "warlord-helmet", "white-book",
  "ak47", "catapult", "big-diamond-ring", "bowie-knife", "heart"
];

const levelConfig = [
  { count: 8, x: 4, y: 4 },
  { count: 12, x: 6, y: 4},
  { count: 16, x: 8, y: 4},
  { count: 20, x: 8, y: 5}
]

const levels = {
  easy: levelConfig[0],
  normal: levelConfig[1],
  hard: levelConfig[2],
  extreme: levelConfig[3]
};

const menuOverlay: HTMLDivElement = document.querySelector("#menu-overlay");

const startMenu: HTMLDivElement = document.querySelector("#start-menu");
const easyBtn: HTMLButtonElement = document.querySelector("#easy");
const normalBtn: HTMLButtonElement = document.querySelector("#normal");
const hardBtn: HTMLButtonElement = document.querySelector("#hard");
const extremeBtn: HTMLButtonElement = document.querySelector("#extreme");

const completeMenu: HTMLDivElement = document.querySelector("#complete-menu");
const repeatBtn: HTMLButtonElement = document.querySelector("#repeat");

const boardTable: HTMLTableElement = document.querySelector("#board-table");

easyBtn?.addEventListener("click", () => {
  chooseLevel("easy");
})
normalBtn?.addEventListener("click", () => {
  chooseLevel("normal");
})
hardBtn?.addEventListener("click", () => {
  chooseLevel("hard");
})
extremeBtn?.addEventListener("click", () => {
  chooseLevel("extreme");
})
repeatBtn?.addEventListener("click", () => {
  console.log("Event")
  reset();
})

let isBlocked = false;

let currentLevel = levels.easy;
let points = 0;
let levelBoard: string[];

const selection: {
  count: number; 
  selected?: HTMLTableCellElement[] } = { count: 0, selected: [] 
};

const initBoard = () => {
  levelBoard = images.sort(() => 0.5 - Math.random()).slice(0,currentLevel.count);
  levelBoard.push(...levelBoard)
  levelBoard.sort(() => 0.5 - Math.random());
  console.log(levelBoard)

  for(let i = 0; i < currentLevel.y; i++){
    const row: HTMLTableRowElement = boardTable.insertRow(i);
    for(let j = 0; j < currentLevel.x; j++){
      const cell = row.insertCell(j);
      cell.className = "field"
      cell.id = `${currentLevel.x*i+j}`
      cell.addEventListener("click", () => handleClick(cell))
    }
  }
}

const reset = () => {
  console.log("reset")
  window.location.reload();
}

const handleClick = (cell: HTMLTableCellElement) => {
  if(cell.classList.contains("open") || isBlocked){
    return;
  }
  const img: HTMLImageElement = new Image();
  const id = Number(cell.id);

  img.src = "../img/" + levelBoard[id]+ ".png";
  img.className = "field-img";
  cell.appendChild(img);
  cell.className = "field open"

  selection.count++
  selection.selected.push(cell)

  if(selection.count == 2){
    isBlocked = true;
    if((selection.selected[0].children[0] as HTMLImageElement).src != (selection.selected[1].children[0] as HTMLImageElement).src){
      delay(1000).then(() => {
        selection.selected.forEach(c => {
          c.className = "field"
          c.removeChild(c.children[0])
          isBlocked = false;
        });
      })

    }else{
      points++;
      selection.count = 0;
      selection.selected = [];
      isBlocked = false;
      
      if(points >= currentLevel.count){
        handleCompletion();
      }

      return;
    }
    delay(1000).then(() => {
      selection.count = 0;
      selection.selected = [];
      isBlocked = false;
    })
  }
}

const handleCompletion = () => {
  menuOverlay.appendChild(completeMenu);
  menuOverlay.style.display = "block";
  completeMenu.style.display = "flex";
}

const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const chooseLevel = async (level: string) => {
  switch(level){
    case "easy":
      currentLevel = levels.easy;
      break;
    case "normal":
      currentLevel = levels.normal;
      break;
    case "hard":
      currentLevel = levels.hard;
      break;
    case "extreme":
      currentLevel = levels.extreme;
      break;
    default:
      currentLevel = levels.normal;
  }
  initBoard();
  menuOverlay.removeChild(startMenu);
  menuOverlay.removeChild(completeMenu);
  menuOverlay.style.display = "none"
}

