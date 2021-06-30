import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {

  const [pos, setPos] = useState({ x: -1, y: -1 });
  const [clicked, setClicked] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [c, setCanv] = useState(null);
  const [answer,setAnswer]=useState('');
  const instance = axios.create({
    baseURL: 'http://localhost:5000/'
  });


  useEffect(() => {
    !c ? setCanv(document.getElementById('canv')) : setCtx(c.getContext('2d'));
  }, [c])


  useEffect(() => {
    if (ctx != null) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 200, 200);
    }
  }, [ctx])



  const changePos = (e) => {
    var rect = c.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    setPos({
      x: posX,
      y: posY
    })
  }

  const handleMove = (e) => {
    if (ctx != null && clicked) {
      ctx.lineWidth = 25;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
      ctx.moveTo(pos.x, pos.y);
      changePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }

  const handleClick = (e) => {
    if (e.buttons !== 1) return;
    if (ctx != null) {
      setClicked(true);
      setPos({ x: e.clientX, y: e.clientY })
    }
  }

  const resetCanvas = (e) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    setPos({ x: -1, y: -1 });
    setAnswer('');
  }

  const classify = () => {
    let img = c.toDataURL();
    const fromData = new FormData();
    fromData.append('img', img);
    instance.post('classify', fromData)
      .then(res => setAnswer(res.data))
      .catch(rej => console.log(rej));
  }


  return (
    <div className="wrapper">
      <div className="content">
        <p>Number classifier</p>
        <h4>Write the number(0-9) to classify</h4>
        <canvas onMouseMove={handleMove} onMouseDown={handleClick}
          onMouseUp={() => { setClicked(false) }}
          id="canv" className="surface" width="200" height="200" />
        <div className="buttons">
          <button onClick={classify}>classify</button>
          <button onClick={resetCanvas}>reset</button>
        </div>
        {answer!==''&&<span>you wrote: {answer}!</span>}
      </div>
    </div>
  );
}

export default App;
