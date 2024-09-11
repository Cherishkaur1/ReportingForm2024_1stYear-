import { Country, State } from "country-state-city"

const gender = [
    "Male",
    "Female",
    "Other"
]

const admission_category = [
    "General",
    "PMS",
    "International"
];

const program_type = [
    "Certification CC",
    "Diploma DD",
    "Under Graduate UG",
    "Undergraduate with Hons. UH",
    "Post Graduate PG",
    "Post Graduate Diploma PD",
    "Research RR",
    "Others"

]

const entry_type = [
    "Lateral",
    "Regular"
]

const initialData = {
    admission_number: '',
    school_name: '',
    department: '',
    program: '',
    name: '',
    father_name: '',
    mother_name: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    contact_number_student: '',
    parent_contact_number: '',
    email_id: '',
    email_id_parent: '',
    date_of_birth: '',
    admission_category :'',
    program_type: '',
    aadhar:'',
    ABCID:'',
    entry_type:'',
    status:'still'
  };

// const HOST = "http://localhost:1000";
const HOST = "http://192.168.124.197:1000";

const getCountryCode = () => {
    return Country.getAllCountries().reduce((accumulator, country) => {
      accumulator[country.name] = country.isoCode;
      return accumulator;
    }, {});
  }
  

const getStateCode = () => {
    return State.getAllStates().reduce((accumulator, state) => {
      accumulator[state.name] = state.isoCode;
      return accumulator;
    }, {});
  }


const countryList = Country.getAllCountries().map((val)=> val.name);
const countryCode = getCountryCode();

const StateCode = getStateCode();

export { gender , admission_category , program_type , entry_type , HOST , initialData , countryList , countryCode , StateCode};