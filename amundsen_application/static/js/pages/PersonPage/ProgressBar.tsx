import * as React from 'react';

import "./ProgressBar.scss"

const PROGRESSBAR_MAX_VALUE = 100; /* If influence is over max value, then use max value for progressbar */
const PROGRESSBAR_LIMIT_VALUE = 30; /* Limit where color changes from grey to pink */

const ProgressBar =  ({percent}) => {
    const width = 150;
    var progress = width;
    var barstyle = "progress-div_high"
    var progress_style = "progress_high"
    
    if (percent < PROGRESSBAR_MAX_VALUE) {
        progress = (percent/100) * width;
        if (percent < PROGRESSBAR_LIMIT_VALUE) {
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