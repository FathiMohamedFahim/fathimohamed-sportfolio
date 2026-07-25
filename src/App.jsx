import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ToolsMarquee from './components/ToolsMarquee'
import About from './components/About'
import Services from './components/Services'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  useEffect(() => {
    // Fade-in via IntersectionObserver (mirrors original JS)
    const faders = document.querySelectorAll('.fade-in')

    const appearOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      })
    }, appearOptions)

    faders.forEach(fader => {
      appearOnScroll.observe(fader)
    })

    // Scroll animation for service/project cards and section titles
    function handleScrollAnimation() {
      const animatedElements = document.querySelectorAll(
        '.service-card, .project-card, .client-card, .contact-form, .section-title'
      )
      animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top
        if (elementPosition < window.innerHeight - 100) {
          element.classList.add('animate-in')
        }
      })
    }

    window.addEventListener('scroll', handleScrollAnimation)
    handleScrollAnimation()

    // Hero element animation delays (mirrors original JS)
    setTimeout(() => {
      const heroSelectors = [
        '.hero-title',
        '.hero-subtitle',
        '.hero-description',
        '.hero-cta',
        '.social-icons',
      ]
      heroSelectors.forEach((selector, index) => {
        const el = document.querySelector(selector)
        if (el) {
          el.classList.add('animate-in')
          el.style.animationDelay = `${index * 0.2}s`
        }
      })
    }, 100)

    return () => {
      window.removeEventListener('scroll', handleScrollAnimation)
      appearOnScroll.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ToolsMarquee />
        <About />
        <Services />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App
