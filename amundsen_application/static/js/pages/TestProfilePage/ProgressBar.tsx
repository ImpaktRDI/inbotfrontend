import * as React from 'react';

import "./ProgressBar.scss"


const ProgressBar =  ({percent}) => {
    const width = 150;
    var progress = width;
    var barstyle = "progress-div_high"
    var progress_style = "progress_high"
    
    if (percent < 10) {
        progress = (percent/10) * width;
        if ((percent/10) < 0.3) {
            barstyle = "progress-div_low"
            progress_style = "progress_low"
        }
        return (
            <div className={barstyle} style={{width: width}}>
                 <div style={{width: `${progress}px`}}className={progress_style}/>
            </div>
          )}

    else {
        return (
            <div className="progress-div_high" style={{width: `${width}px`}}>
                 <div style={{width: `${progress}px`}}className={progress_style}/>
            </div>
          )}
}

export default ProgressBar;