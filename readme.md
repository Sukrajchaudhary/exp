//filtering business
http://localhost:8080/api/getservice?state=Bagmati & city=kathmandu &serviceCategory=Graphic Design
<!-- register Business -->
http://localhost:8080/api/register
 {
    "email": "test@example.com",
    "verifyNumber": "990011",
    "phone": "567-890-1234",
    "businessName": "AI/ML",
    "serviceCategory": "Graphic Design",
    "state": "Bagmati",
    "city": "Kathmandu"
  }
  <!-- update info -->
  http://localhost:8080/api/updateinfo/664848107ef9df7d8cb2a629

  {
       "state": "Bagmati",
  }
  <!--getStatesCitiesServices -->
  http://localhost:8080/api/getStatesCitiesServices
  <!-- get all business -->
  http://localhost:8080/api/allbusiness