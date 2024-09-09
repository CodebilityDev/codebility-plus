import React from 'react'
import BuilderForms from '../_components/builder-forms'
import BuilderScreen from '../_components/builder-screen'
import BuilderNavbar from '../_components/builder-navbar'

function BuilderEditorPage() {
  return (
    <div className="mt-5 flex flex-col gap-y-5 px-8">
      <BuilderNavbar />
      <div className="flex justify-center">
        <BuilderForms />
        <BuilderScreen />
      </div>
    </div>
  )
}

export default BuilderEditorPage
