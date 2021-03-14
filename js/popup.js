const app = document.getElementById('app')
const list = [
    'kkkk',
    'lllll'
]
const lis = list.map(t => `<li>${t}</li>`).join('');
app.innerHTML = `<ul>${lis}</ul>`

app.addEventListener('click', () => {
    const open = window.open('http://business.sit.xiaohongshu.com/ares/login');
    console.log(open)
})