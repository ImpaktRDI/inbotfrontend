import * as React from 'react';

import "./ProgressBar.scss"

const PROGRESSBAR_LIMIT_VALUE = 30; /* Limit where color changes from grey to pink */
const PROGRESSBAR_WIDTH = 150;

const ProgressBar = ({ percent }) => {
    const progress = percent / 100 * PROGRESSBAR_WIDTH;
    const [ barstyle, progress_style ] = percent < PROGRESSBAR_LIMIT_VALUE
        ? [ "progress-div-low", "progress-low" ]
        : [ "progress-div-high", "progress-high" ]

    return (
        <div className={barstyle} style={{ width: PROGRESSBAR_WIDTH }}>
            <div style={{ width: `${progress}px` }} className={progress_style} />
        </div>
    )
}

export default ProgressBar;