// Content now lives in JSON files so the admin CMS (see /admin) can edit them
// directly. This file just re-exports them so existing imports throughout the
// app (e.g. `import { projects } from '../data/projects'`) keep working.
import projectsData from './projects.json'
import testimonialsData from './testimonials.json'
import servicesData from './services.json'

export const projects = projectsData.projects
export const testimonials = testimonialsData.testimonials
export const services = servicesData.services
