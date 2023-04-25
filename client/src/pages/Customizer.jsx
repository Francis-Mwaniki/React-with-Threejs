import React,{useEffect,useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {useSnapshot} from 'valtio'
import config from '../config/config'
import state from '../store'
import {download} from '../assets';
import {downloadCanvasToImage, reader} from '../config/helpers'
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants'
import {fadeAnimation, slideAnimation} from '../config/motion'
import { AiPicker, Tab, ColorPicker,FilePicker, CustomButton} from '../components'
const Customizer = () => {
  const snap = useSnapshot(state)
  const [file, setFile] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setgeneratingImg]=useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
        readFile={readFile}
        file={file}
        setFile={setFile}
        />
      case "aipicker":
        return <AiPicker 
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={generatingImg}
        handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }
  const handleSubmit = async (type) => {
    console.log(prompt);
    if(prompt==="") return alert("Please enter a prompt");

    try {
      setgeneratingImg(true);

      const response = await fetch('https://dalle-server-n2wj.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
        })
      })

      const data = await response.json();
      console.log(data);

      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      console.log(error);
    } finally {
      setgeneratingImg(false);
      setActiveEditorTab("");
    }
  }
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }
  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

 
  return (
    <AnimatePresence>
    {!snap.intro && (
    <>
    
    <motion.div key='custom' className=' top-0 left-0 z-10 absolute' {...slideAnimation('left')}>
    <div className=" flex items-center min-h-screen">
      <div className=" editortabs-container tabs">
        {EditorTabs.map((tab) => (
          <Tab
          key={tab.name}
          tab={tab}
          handleClick={() => setActiveEditorTab(tab.name)}
          />
        ))
          }
          {generateTabContent()}
      </div>
    </div>
    </motion.div>
   
    <motion.div className='absolute z-10 top-5 right-5'
    {...fadeAnimation}
    >
     <CustomButton
     title={'Go Back'}
      handleClick={()=>{state.intro = true}}
      customStyles={'w-fit py-2.5 px-4 font-bold text-sm'}
      type={'filled'}
     />
    </motion.div>
    <motion.div 
     className='filtertabs-container'
      {...slideAnimation('up')}
    >
        {FilterTabs.map((tab) => (
          <Tab
          key={tab.name}
          tab={tab}
          isFilterTab
          isActiveTab={activeFilterTab[tab.name]}
          handleClick={() => handleActiveFilterTab(tab.name)}
          />
        ))
          }
    </motion.div>
    <motion.div className='absolute z-10 bottom-5 right-5'
    {...fadeAnimation}
    >
      <CustomButton
      title={'Download'}
      handleClick={()=>{downloadCanvasToImage(config.canvasId)}}
      customStyles={'w-fit py-2.5 px-4 font-bold text-sm'}
      type={'filled'}
      />

    </motion.div>
   
    </>
  )}
  </AnimatePresence>
  )
}

export default Customizer