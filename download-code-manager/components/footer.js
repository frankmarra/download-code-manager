const today = new Date()
const year = today.getFullYear()

const Footer = () => {
  return (
    <footer>
      <div style={{ textAlign: 'center' }}>
        <p>
          <a
            href="https://mysterycircles.com/donate-to-mc"
            target="_blank"
            rel="noopener"
            className="footer-link"
          >
            Buy us a coffee?{' '}
          </a>
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <a
          href="mailto:mysterycircles@gmail.com?subject=I%20am%20interested%20in%20joining"
          target="_blank"
          rel="noopener"
          className="footer-link"
        >
          Interested in joining?{' '}
        </a>
      </div>
      <div>
        <p>© {year} downloadcodemanager.com</p>
      </div>
    </footer>
  )
}

export default Footer
