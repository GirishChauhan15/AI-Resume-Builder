import { forwardRef, useEffect, useState } from 'react'; 
import {    
    BtnBold,   
    BtnItalic,   
    Editor,   
    EditorProvider,     
    BtnBulletList,     
    BtnNumberedList,     
    BtnRedo,     
    BtnStrikeThrough,     
    BtnUnderline,     
    BtnUndo,     
    Separator,     
    Toolbar  
} from 'react-simple-wysiwyg'; 

function RTK({handleRTK, info}, ref) {   
    const [value, setValue] = useState('');    

    useEffect(() => {       
      setValue(info);
    }, [info]);


    function onChange(e) {     
        const newValue = e.target.value;
        setValue(newValue.slice(0, 390));
        handleRTK(e); 
    }

    return (     
        <EditorProvider>       
            <Editor 
                value={value} 
                className='text-sm' 
                onChange={onChange} 
                ref={ref}>
                <Toolbar>
                    <BtnBold />           
                    <BtnItalic />           
                    <BtnUnderline />           
                    <BtnStrikeThrough />           
                    <Separator />           
                    <BtnNumberedList />           
                    <BtnBulletList />           
                    <Separator />           
                    <BtnUndo />           
                    <BtnRedo />           
                    <Separator />         
                </Toolbar>       
            </Editor>     
        </EditorProvider>   
    ); 
}

export default forwardRef(RTK);
