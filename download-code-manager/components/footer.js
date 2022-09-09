const today = new Date()
const year = today.getFullYear()

const Footer = () => {
  return (
    <footer>
      <div>
        <p>© {year} downloadcodemanager.com</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <a
          href="mailto:mysterycircles@gmail.com?subject=I%20am%20interested%20in%20joining"
          target="_blank"
          rel="noopener"
        >
          Interested in joining?{' '}
        </a>
      </div>
      <div style={{ textAlign: 'center' }}>
        <a
          href="https://mysterycircles.com/donate-to-mc"
          target="_blank"
          rel="noopener"
        >
          Buy us a coffee?{' '}
        </a>
      </div>
    </footer>
  )
}

export default Footer
