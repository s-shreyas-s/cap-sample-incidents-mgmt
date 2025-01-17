const cds = require('@sap/cds/lib')
const { GET, POST, DELETE, expect } = cds.test(__dirname + '../../')

jest.setTimeout(11111)

describe('Test The GET Endpoints', () => {
  it('Should check Incident Service', async () => {
    const incidentsService = await cds.connect.to('IncidentsService')
    const { Incidents } = incidentsService.entities
    expect(await SELECT.from(Incidents)).to.have.length(4)
  })
})

describe('Draft Choreography APIs', () => {
  let draftId

  it('Create an incident', async () => {
    const { status, statusText, data } = await POST(`/incidents/Incidents`, {
      title: 'test3',
      urgency_code: 'H',
      status_code: 'A'
    })
    draftId = data.ID
    expect(status).to.equal(201)
    expect(statusText).to.equal('Created')
  })

  it('+ Activate the draft', async () => {
    const response = await POST(
      `/incidents/Incidents(ID=${draftId},IsActiveEntity=false)/IncidentsService.draftActivate`
    )
    expect(response.status).to.eql(201)
  })

  it('+ Test the verification status', async () => {
    const response = await GET(`/incidents/Incidents(ID=${draftId},IsActiveEntity=true)`)
    expect(response.status).to.eql(200)
  })

  it('- Delete the Incident', async () => {
    const response = await DELETE(`/incidents/Incidents(ID=${draftId},IsActiveEntity=true)`)
    expect(response.status).to.eql(204)
  })
})
