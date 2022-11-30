import React, { useEffect, useState } from 'react';

import './App.css';

import Axios from "axios";
import FileDownload from "js-file-download";

function App() {
  const [parent, setParent] = useState('');
  const [data, setData] = useState({
    path: "",
    files: []
});

    useEffect(() =>{
      fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(
        (result) => {
          setParent('');
          setData(result);
        },
        (error) => {
        
        }
      )
    }, []);

    const clickHandler = event =>{
      event.preventDefault();
      //console.log(event.target.attributes.href.value);
      fetch("http://localhost:8000/?path="+event.target.attributes.href.value)
        .then(res => res.json())
        .then(
            (result) => {
                let linkArr = result.path.split('/');
                console.log(linkArr);
                linkArr.pop();
                setParent(linkArr.join('/'));
                setData(result);
            },
            (error) => {
            }
        );
    }

    const downloader = event =>{
      event.preventDefault();
      Axios({
        url: "http://localhost:8000/?path="+event.target.attributes.href.value,
        method: "GET",
        responseType: "blob",
      }).then((res) => {
        console.log(res);

        FileDownload(res.data, event.target.attributes.href.value.split('/').pop());
        
      });
    };

  return (
    <div className="file-manager">
      <div className="current-level">
          current: {data.path === '' ? '/' : data.path}
      </div>
      
      <div id="q">
          <a href={parent} onClick={clickHandler}>
              GO UP
          </a>
      </div>
      
      <ul className="folder-list">
        {data.files.map(item =>{

          if (item.dir){
            return <li className="folder" key={item.name}>
                <a href={data.path+'/'+item.name} onClick={clickHandler}>
                <span className="material-icons">&#xe2c7;</span>
                {item.name.toUpperCase()}
                </a>
              </li>
          }
          else{
            return <li key={item.name} className="file">
              <a id="down" href={data.path+'/'+item.name} onClick={downloader}>
              <span className="material-icons">&#xe873;</span>
              {item.name}
              </a>
              </li>
          }

        })}
      </ul>
    </div>
  );
}

export default App;
