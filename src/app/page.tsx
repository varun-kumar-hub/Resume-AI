'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, CheckCircle, FileText, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50 overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              RA
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Resume AI
            </span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center space-y-10 px-4 py-24 text-center sm:px-6 lg:px-8">
        {/* floating shapes */}
        <div
          className="pointer-events-none absolute top-10 left-10 h-32 w-32 rounded-full bg-blue-300 opacity-20"
        />
        <div
          className="pointer-events-none absolute bottom-20 right-20 h-40 w-40 rounded-full bg-purple-300 opacity-20"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-3xl space-y-6"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Optimize your resume for <span className="text-blue-600">ATS</span> &{' '}
            <span className="text-blue-600">Humans</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-gray-500 dark:text-gray-400 md:text-xl">
            Get instant, AI-enhanced feedback on your resume. Identify skill gaps, improve formatting, and beat the Application Tracking Systems.
          </p>
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link href="/login">
              <Button size="lg" className="h-12 bg-blue-600 px-8 text-lg hover:bg-blue-700">
                Analyze My Resume <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-3 mx-auto max-w-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">ATS Parsing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  See exactly what recruiters see. Our deterministic parser highlights parsing errors.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Skill Gap Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Compare your skills against job descriptions to find missing keywords.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Instant Feedback</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your PDF and get actionable insights in seconds.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 Resume AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
