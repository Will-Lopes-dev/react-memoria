import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimerElapsed } from './helpers/formatTimerElapsed';


function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const[movieCount, setMoveCount] = useState<number>(0);
  const[showCount, setShowCount] = useState<number>(0);
  const[gridItems, setGridItems] = useState<GridItemType[]>([]);


  useEffect(() => resetAndCreateGrid(), []);

  useEffect(()=> {
    const timer = setInterval(()=> {
      if(playing) setTimeElapsed(timeElapsed +1);
    }, 1000);
    return () => clearInterval(timer);
  },[playing, timeElapsed]);

  // verificar se os abertos são iguais
  useEffect(()=>{
    if(showCount === 2) {

      let opened = gridItems.filter(item => item.shown === true);

      if(opened.length === 2) {
        // v1 - se eles iguais, torná-los permanentes
        let tempGrid = [...gridItems];

        if(opened[0].item === opened[1].item) {
          for(let i in tempGrid) {
            if(tempGrid[i].shown) {
              tempGrid[i].permanentShown = true;
              tempGrid[i].shown = false;
            }
          }
          setGridItems(tempGrid);
          setShowCount(0);
        } else {
          //v2 - se eles não são iguaos, torne-os fechados
          setTimeout(() => {
            let tempGrid = [...gridItems];

            for(let i in tempGrid) {
              tempGrid[i].shown = false;
            }
            setGridItems(tempGrid);
            setShowCount(0);
          }, 1000);
        }
       

        setMoveCount(movieCount => movieCount +1);
      }
    }
  }, [showCount, gridItems]);

  //verificar se o jogo acabou.
  useEffect(()=> {
    if(movieCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [movieCount, gridItems]);

  const resetAndCreateGrid = () => {
    // passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);

    // passo 2 - criar um grid
    // 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false, 
        permanentShown: false
      });
    }

    //2.2 - preencher o grid
    for(let w = 0; w < 2; w++) {
      for(let i = 0; i < items.length; i++) {
        let pos = -1;
        while(pos <0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));

        }

        tmpGrid[pos].item = i;
      }
    }

    //2.3 - jogar no state
    setGridItems(tmpGrid);

    // passo 3 - começar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShowCount(showCount + 1);
      }
      setGridItems(tmpGrid);
    }
  }
  
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width={200} alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimerElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={movieCount.toString()} />
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid}/>

      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=> (
            <GridItem
              key={index} 
              item={item}
              onClick={()=> handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App
