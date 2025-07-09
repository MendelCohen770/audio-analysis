import React from 'react'
import '../style/InsightBox.css'

function InsightBox({ text, visible }: { text: string, visible: boolean }) {
    return (
      <div
        className={`insight-box${visible ? ' show' : ' hide'}`}
        style={{ direction: 'rtl' }}
      >
        {text}
      </div>
    );
  }

export default InsightBox
