import {
  HydraAdmin,
  ResourceGuesser,
} from '@api-platform/admin'
import React from 'react'
import { Resource } from 'react-admin'
import { render } from 'react-dom'

const Admin = (
  <React.StrictMode>
    <HydraAdmin entrypoint="/api/v2">
      <ResourceGuesser name="warehouse_places"/>
      <ResourceGuesser name="warehouse_tags"/>
      {/*just for autocomplete to work*/}
      <Resource name="parts"/>
      <Resource name="manufacturers"/>
      <Resource name="price_lists"/>
      <Resource name="suppliers"/>
    </HydraAdmin>
  </React.StrictMode>
)
render(Admin, document.getElementById('back_office_admin') as HTMLDivElement)
// TODO for React DOM 18
// createRoot(document.getElementById('back_office_admin') as HTMLDivElement).render(Admin)
