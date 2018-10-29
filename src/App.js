import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import DrawableCanvas from 'react-drawable-canvas';
import * as jsPDF from 'jspdf'
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            numPages: null,
            pageNumber: 1,
            resultPDF: false,
            height: '90vh',
            drawableCanvas: {
                brushColor: 'black',
                lineWidth: 12,
            }
        };
    }

    handleChange(files) {
        this.setState({file: files[0]});
    };

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    onSave() {
        const firstElem = document.querySelector('.react-pdf__Page__canvas');
        const secondElem = document.querySelector('.test-canvas canvas');

        const resultCanvas = document.getElementById('test');
        resultCanvas.style.width = '100%';
        resultCanvas.style.height = '100%';
        resultCanvas.width = firstElem.offsetWidth;
        resultCanvas.height = firstElem.offsetHeight;
        const resultContext = resultCanvas.getContext('2d');

        resultContext.drawImage(firstElem, 0, 0, firstElem.offsetWidth, firstElem.offsetHeight);
        resultContext.drawImage(secondElem, 0, 0);

        const imgData = resultCanvas.toDataURL('image/jpeg');
        const pdf = new jsPDF('p', 'px', [816, 1056]);

        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.addPage();
        pdf.addPage();
        pdf.save('download.pdf');
        this.setState({ resultPDF: true})
    }

    render() {
        const { file, resultPDF, pageNumber, drawableCanvas } = this.state;
        return (
          <div className="App">
              <header className="App-header">
                  <input onChange={(e) => this.handleChange(e.target.files)} type="file" id="file" />
              </header>
              <div className="container">
                  <div className="sidebar"><input onClick={() => this.onSave()} type="button" value="Save PDF"/></div>
                  <div className="pdf-container-wrapper">
                      {
                          !resultPDF && (
                              <div className="test-canvas">
                                  <DrawableCanvas {...drawableCanvas} ref={this.drawableCanvas}/>
                              </div>
                          )
                      }
                      {
                          !resultPDF && (
                              <Document
                                  width={1200}
                                  onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                                  onLoadError={(e) => console.log(e)}
                                  file={file}
                              >
                                  <Page
                                      pageNumber={pageNumber} width={1200} scale={1.0} renderTextLayer={true} renderInteractiveForms={true}>
                                  </Page>
                              </Document>
                          )
                      }
                      <div className="wrapper-item result-canvas">
                          <canvas id="test" width="1200" ></canvas>
                      </div>
                  </div>
                  <div className="sidebar">sidebar</div>
              </div>
          </div>
        );
    }
}

export default App;
