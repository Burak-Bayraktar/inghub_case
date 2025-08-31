export const mockEmployees = [
  { id:'1', firstName:'Ahmet', lastName:'Yılmaz', doe:'23/09/2022', dob:'15/03/1990', phone:'+(90) 532 123 45 67', email:'ahmet.yilmaz@ing.com', dept:'Analytics', position:'Senior' },
  { id:'2', firstName:'Mehmet', lastName:'Kaya', doe:'15/06/2021', dob:'20/08/1985', phone:'+(90) 532 234 56 78', email:'mehmet.kaya@ing.com', dept:'Tech', position:'Senior' },
  { id:'3', firstName:'Ayşe', lastName:'Demir', doe:'10/01/2023', dob:'12/11/1992', phone:'+(90) 532 345 67 89', email:'ayse.demir@ing.com', dept:'Analytics', position:'Medior' },
  { id:'4', firstName:'Fatma', lastName:'Öz', doe:'05/04/2022', dob:'18/07/1988', phone:'+(90) 532 456 78 90', email:'fatma.oz@ing.com', dept:'Tech', position:'Senior' },
  { id:'5', firstName:'Ali', lastName:'Çelik', doe:'12/11/2020', dob:'25/02/1987', phone:'+(90) 532 567 89 01', email:'ali.celik@ing.com', dept:'Analytics', position:'Senior' },
  { id:'6', firstName:'Zeynep', lastName:'Arslan', doe:'08/07/2023', dob:'30/05/1991', phone:'+(90) 532 678 90 12', email:'zeynep.arslan@ing.com', dept:'Tech', position:'Junior' },
  { id:'7', firstName:'Murat', lastName:'Koç', doe:'22/03/2021', dob:'14/09/1989', phone:'+(90) 532 789 01 23', email:'murat.koc@ing.com', dept:'Analytics', position:'Junior' },
  { id:'8', firstName:'Elif', lastName:'Şahin', doe:'17/12/2022', dob:'22/01/1993', phone:'+(90) 532 890 12 34', email:'elif.sahin@ing.com', dept:'Tech', position:'Medior' },
  { id:'9', firstName:'Hasan', lastName:'Polat', doe:'29/05/2020', dob:'08/06/1984', phone:'+(90) 532 901 23 45', email:'hasan.polat@ing.com', dept:'Analytics', position:'Senior' },
  { id:'10', firstName:'Gül', lastName:'Aydın', doe:'13/09/2023', dob:'11/12/1990', phone:'+(90) 532 012 34 56', email:'gul.aydin@ing.com', dept:'Tech', position:'Senior' },
  { id:'11', firstName:'Emre', lastName:'Yıldız', doe:'04/02/2022', dob:'26/10/1986', phone:'+(90) 532 123 45 78', email:'emre.yildiz@ing.com', dept:'Analytics', position:'Medior' },
  { id:'12', firstName:'Seda', lastName:'Tunç', doe:'19/08/2021', dob:'07/04/1991', phone:'+(90) 532 234 56 89', email:'seda.tunc@ing.com', dept:'Tech', position:'Junior' },
  { id:'13', firstName:'Burak', lastName:'Özkan', doe:'26/06/2023', dob:'13/08/1989', phone:'+(90) 532 345 67 90', email:'burak.ozkan@ing.com', dept:'Analytics', position:'Senior' },
  { id:'14', firstName:'Deniz', lastName:'Güneş', doe:'11/10/2020', dob:'29/01/1992', phone:'+(90) 532 456 78 01', email:'deniz.gunes@ing.com', dept:'Tech', position:'Junior' },
  { id:'15', firstName:'Kemal', lastName:'Doğan', doe:'02/12/2022', dob:'16/11/1985', phone:'+(90) 532 567 89 12', email:'kemal.dogan@ing.com', dept:'Analytics', position:'Medior' },
  { id:'16', firstName:'Nermin', lastName:'Kurt', doe:'18/04/2021', dob:'21/07/1990', phone:'+(90) 532 678 90 23', email:'nermin.kurt@ing.com', dept:'Tech', position:'Senior' },
  { id:'17', firstName:'Oğuz', lastName:'Bal', doe:'25/01/2023', dob:'05/03/1988', phone:'+(90) 532 789 01 34', email:'oguz.bal@ing.com', dept:'Analytics', position:'Medior' },
  { id:'18', firstName:'Pınar', lastName:'Erdoğan', doe:'14/07/2022', dob:'19/09/1991', phone:'+(90) 532 890 12 45', email:'pinar.erdogan@ing.com', dept:'Tech', position:'Junior' },
  { id:'19', firstName:'Serkan', lastName:'Uçar', doe:'09/11/2020', dob:'12/05/1987', phone:'+(90) 532 901 23 56', email:'serkan.ucar@ing.com', dept:'Analytics', position:'Senior' },
  { id:'20', firstName:'Tülay', lastName:'Keskin', doe:'21/05/2023', dob:'28/12/1989', phone:'+(90) 532 012 34 67', email:'tulay.keskin@ing.com', dept:'Tech', position:'Medior' },
  { id:'21', firstName:'Ufuk', lastName:'Başer', doe:'07/03/2021', dob:'03/08/1986', phone:'+(90) 532 123 45 89', email:'ufuk.baser@ing.com', dept:'Analytics', position:'Senior' },
  { id:'22', firstName:'Vildan', lastName:'Çakır', doe:'16/09/2022', dob:'17/02/1993', phone:'+(90) 532 234 56 90', email:'vildan.cakir@ing.com', dept:'Tech', position:'Senior' },
  { id:'23', firstName:'Yusuf', lastName:'Akgül', doe:'24/08/2020', dob:'10/06/1984', phone:'+(90) 532 345 67 01', email:'yusuf.akgul@ing.com', dept:'Analytics', position:'Senior' },
];

export class EmployeeService {
  static getAllEmployees() {
    return mockEmployees;
  }

  static getEmployeesPaginated(page = 1, pageSize = 5) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: mockEmployees.slice(startIndex, endIndex),
      total: mockEmployees.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(mockEmployees.length / pageSize)
    };
  }

  static getEmployeeById(id) {
    return mockEmployees.find(employee => employee.id === id);
  }
}
