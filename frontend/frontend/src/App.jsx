import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/*************************************************
 * Helper – Dynamically load Babel (for JSX eval) *
 *************************************************/
const useBabel = () => {
  const [ready, setReady] = useState(() => !!window.Babel);
  useEffect(() => {
    if (ready) return;
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@babel/standalone@7/babel.min.js';
    s.onload = () => setReady(true);
    s.onerror = () => console.error('❌ Failed to load Babel');
    document.head.appendChild(s);
  }, [ready]);
  return ready;
};

/*********************************************
 * Utility – strip ``` fences from GPT output *
 *********************************************/
const stripMarkdownFence = (raw) =>
  raw.replace(/^```[a-z]*\n?/i, '').replace(/```\s*$/i, '').trim();

/*********************************
 * Drag source wrapper component *
 *********************************/
const DraggableComponent = ({ Comp, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { id, Comp },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [id, Comp]);
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.4 : 1, cursor: 'grab' }}>
      <Comp />
    </div>
  );
};

/************************
 * Drop target (Canvas) *
 ************************/
const DroppableCanvas = ({ components, setComponents }) => {
  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item) => setComponents((prev) => [...prev, item.Comp]),
  }), [setComponents]);
  return (
    <div ref={drop} style={{ flex: 1, overflowY: 'auto', background: '#1d1d1d', color: '#fff', padding: 24 }}>
      <h3 style={{ marginTop: 0 }}>Canvas</h3>
      {components.length === 0 && <p style={{ color: '#888' }}>Drag components here…</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {components.map((Comp, idx) => (
          <div key={idx} style={{ border: '1px solid #444', padding: 12, borderRadius: 6 }}>
            <Comp />
          </div>
        ))}
      </div>
    </div>
  );
};

/*****************
 * Main  <App /> *
 *****************/
export default function App() {
  const babelReady = useBabel();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // {role, text, code, Comp}
  const [canvasComponents, setCanvasComponents] = useState([]);
  const [err, setErr] = useState('');

  /**
   * Robust compile helper – handles:
   * 1. Full function with export default
   * 2. Function without export
   * 3. Raw JSX snippet ⇢ wrapped automatically
   */
  const compileComponent = (jsxCode) => {
    if (!babelReady) return () => <em style={{ color: '#888' }}>Compiler loading…</em>;

    let cleaned = stripMarkdownFence(jsxCode).trim();
    cleaned = cleaned.replace(/export\s+default\s+/i, '');

    // Case 3: raw JSX
    if (/^<\w+/m.test(cleaned)) {
      cleaned = `function GeneratedComponent() {\n  return (${cleaned});\n}`;
    }
    // Ensure a GeneratedComponent is declared
    if (!/GeneratedComponent/.test(cleaned)) {
      cleaned = `function GeneratedComponent() {\n  return (${cleaned});\n}`;
    }

    try {
      const transformed = window.Babel.transform(cleaned, { presets: ['react'] }).code;
      console.log('%cTransformed JS:', 'color:#00e676', transformed);
      // eslint-disable-next-line no-new-func
      const fn = new Function('React', `${transformed}; return GeneratedComponent;`);
      return fn(React);
    } catch (e) {
      console.error('❌ Compile error:', e.message, '\nCleaned JSX:\n', cleaned);
      return () => <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>Compile Error: {e.message}\n---\n{cleaned}</pre>;
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    const userPrompt = prompt.trim();
    setPrompt('');
    setMessages((p) => [...p, { role: 'user', text: userPrompt }]);

    try {
      const { data } = await axios.post('http://localhost:8000/generate-component', { prompt: userPrompt });
      const code = data.component;
      const Comp = compileComponent(code);
      setMessages((p) => [...p, { role: 'assistant', text: 'Generated component:', code, Comp }]);
    } catch (e) {
      console.error(e);
      setErr('Generation failed – see console');
    }
  };

  const ChatBubble = ({ msg, idx }) => (
    <div style={{ margin: '8px 0', padding: 12, background: '#262626', borderRadius: 6 }}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
      {msg.Comp && (
        <div style={{ marginTop: 8 }}>
          <DraggableComponent Comp={msg.Comp} id={idx} />
          <details style={{ marginTop: 6 }}>
            <summary style={{ cursor: 'pointer', color: '#9aa0a6' }}>Show JSX</summary>
            <SyntaxHighlighter language="jsx" style={tomorrow} customStyle={{ background: '#202124' }}>
              {stripMarkdownFence(msg.code)}
            </SyntaxHighlighter>
          </details>
        </div>
      )}
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', background: '#181818', color: '#e8eaed', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Chat Panel */}
        <div style={{ width: '28%', minWidth: 320, borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {messages.map((m, i) => <ChatBubble key={i} msg={m} idx={i} />)}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid #333', display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, padding: 10, background: '#303134', border: 'none', color: '#fff', borderRadius: 6 }}
              placeholder="Describe a UI element…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
            />
            <button
              style={{ padding: '10px 18px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, opacity: babelReady ? 1 : 0.6 }}
              onClick={sendPrompt}
              disabled={!babelReady}
            >
              Send
            </button>
          </div>
          {err && <p style={{ color: 'red', margin: 10 }}>{err}</p>}
        </div>
        {/* Canvas */}
        <DroppableCanvas components={canvasComponents} setComponents={setCanvasComponents} />
      </div>
    </DndProvider>
  );
}
