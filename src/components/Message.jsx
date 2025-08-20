// src/components/Message.jsx
const Message = ({ variant = 'info', children }) => {
const getVariantClass = () => {
if (variant === 'danger') return { backgroundColor: '#f8d7da', color: '#721c24' };
return { backgroundColor: '#d1ecf1', color: '#0c5460' };
};
const style = {
padding: '1rem',
margin: '1rem 0',
border: '1px solid transparent',
borderRadius: '0.25rem',
...getVariantClass(),
};
return <div style={style}>{children}</div>;
};
export default Message;