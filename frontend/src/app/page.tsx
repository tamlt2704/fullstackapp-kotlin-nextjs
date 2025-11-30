export default function Home() {
  const projects = [
    {
      title: "E-Commerce Platform",
      tech: "React, Node.js, MongoDB",
      description: "Full-stack e-commerce with payment integration",
      github: "#",
      demo: "#"
    },
    {
      title: "Task Management App",
      tech: "Next.js, PostgreSQL, Prisma",
      description: "Real-time collaborative task management",
      github: "#",
      demo: "#"
    },
    {
      title: "Authentication System",
      tech: "Kotlin Spring Boot, Next.js",
      description: "Role-based auth with JWT tokens",
      github: "#",
      demo: "/auth"
    }
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0', color: '#333' }}>John Developer</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', margin: '10px 0' }}>Full Stack Developer</p>
        <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>
          Passionate about building scalable web applications with modern technologies.
          Experienced in React, Node.js, Spring Boot, and cloud platforms.
        </p>
      </header>

      {/* Skills */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Kotlin', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'AWS'].map(skill => (
            <span key={skill} style={{ 
              background: '#f0f0f0', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {projects.map((project, index) => (
            <div key={index} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px',
              background: '#fff'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{project.title}</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>{project.tech}</p>
              <p style={{ margin: '0 0 20px 0' }}>{project.description}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={project.github} style={{ 
                  color: '#0070f3', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid #0070f3',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>GitHub</a>
                <a href={project.demo} style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  background: '#0070f3',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>Demo</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{ textAlign: 'center', padding: '40px 0', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '20px' }}>Get In Touch</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>Interested in working together? Let's connect!</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="mailto:john@example.com" style={{ color: '#0070f3', textDecoration: 'none' }}>Email</a>
          <a href="#" style={{ color: '#0070f3', textDecoration: 'none' }}>LinkedIn</a>
          <a href="#" style={{ color: '#0070f3', textDecoration: 'none' }}>GitHub</a>
        </div>
      </section>

      {/* Admin Link */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a href="/admin" style={{ color: '#666', textDecoration: 'underline', fontSize: '14px' }}>
          Admin Dashboard
        </a>
        <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
        <a href="/auth" style={{ color: '#666', textDecoration: 'underline', fontSize: '14px' }}>
          Authentication Demo
        </a>
        <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
        <a href="/blog" style={{ color: '#666', textDecoration: 'underline', fontSize: '14px' }}>
          Blog
        </a>
      </div>
    </div>
  )
}