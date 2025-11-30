export default function Navbar() {
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px'
      }}>
        <a href="/" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textDecoration: 'none',
          color: '#333'
        }}>
          John Developer
        </a>
        
        <div style={{ display: 'flex', gap: '30px' }}>
          <a href="/" style={{
            textDecoration: 'none',
            color: '#666',
            fontSize: '16px'
          }}>
            Home
          </a>
          <a href="/blog" style={{
            textDecoration: 'none',
            color: '#666',
            fontSize: '16px'
          }}>
            Blog
          </a>
          <a href="/auth" style={{
            textDecoration: 'none',
            color: '#666',
            fontSize: '16px'
          }}>
            Auth
          </a>
          <a href="/admin" style={{
            textDecoration: 'none',
            color: '#666',
            fontSize: '16px'
          }}>
            Admin
          </a>
        </div>
      </div>
    </nav>
  )
}