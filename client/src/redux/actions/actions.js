import axios from "axios"
import { AngelGit, Sergiogit, Ultimate, localhost } from "../../Deploys";


export const GET_AUTORS = "GET_AUTORS";
export const GET_REVIEWS = 'GET_REVIEWS';
export const GET_ADVISORS = 'GET_ADVISORS';
export const ADVISOR_DETAIL = 'ADVISOR_DETAIL';
export const LOAD_PROFESSIONALS = "LOAD_PROFESSIONALS";
export const FILTER_BY_SPECIALTY = "FILTER_BY_SPECIALTY";
export const FILTER_BY_LANGUAGE = "FILTER_BY_LANGUAGE";
export const FILTER_BY_PROGRAMMING_LANGUAGE = "FILTER_BY_PROGRAMMING_LANGUAGE";
export const FILTER_BY_RESIDENCE = "FILTER_BY_RESIDENCE";
export const SORT_ADVISORS = "SORT_ADVISORS";
export const SORT_BY_AVAILABILITY = "SORT_BY_AVAILABILITY";
export const SORT_BY_PRICE = "SORT_BY_PRICE";
export const SORT_BY_ALPHABET = "SORT_BY_ALPHABET";
export const GET_TECHSKILLS = 'GET_TECHSKILLS';
export const GET_PROFILE = 'GET_PROFILE'
export const GET_ADVISORS_REVIEWS = 'GET_ADVISORS_REVIEWS'
export const BLOCK_ACCOUNT = 'BLOCK_ACCOUNT'
export const UNBLOCK_ACCOUNT = 'UNBLOCK_ACCOUNT'
export const UPDATE_DATES = 'UPDATE_DATES'
export const UPDATE_AVAILABILITY = 'UPDATE_AVAILABILITY'
export const GET_AVAILABILITY = 'GET_AVAILABILITY'

const Server = localhost;


export const updateAvailability = (timeSpans,id) => {
  return async function (dispatch) {
    
    try {
      const apiData = await axios.get(`${Server}/Advisors/${id}`);   // link1 
      const schedules = apiData.data.Schedules;
      console.log("schedules " + schedules)

      let matchingObjectIndex = -1;

      for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].Day === timeSpans.Day &&
          schedules[i].Month === timeSpans.Month &&
          schedules[i].Year === timeSpans.Year) {
          matchingObjectIndex = i;
          break;
        }
      }

      if (matchingObjectIndex >= 0) {
        schedules[matchingObjectIndex].State = timeSpans.State;
        await axios.put(`ruta para remplazar los horarios`, schedules);
      } else if (timeSpans.State === "reserved" || timeSpans.State === "available") {
        schedules.push(timeSpans);
        await axios.put(`ruta para remplazar los horarios`, schedules);
      }

      const updatedApiData = await axios.get(`${Server}/Advisors/${id}`);     // link1
      const updatedSchedules = updatedApiData.data.Schedules;

      dispatch({ type: UPDATE_AVAILABILITY, payload: updatedSchedules });
    } catch (error) {
      console.error(error);
    }
  };
};



export const getAvailability = (id) => {
  return async function (dispatch) {
    const apiData = await axios.get(`${Server}/Advisors/${id}`);    // link1 
    //const apiData = await axios.get(`https://code-advisor-back.vercel.app/Advisors/001`);
    const timeSpans = apiData.data;
    dispatch({ type: GET_AVAILABILITY, payload: timeSpans });

  };
};


export const getAutors = () => {
  return async function (dispatch) {
    const apiData = await axios.get(`${Server}/data/autores/`);      // link2
    const autors = apiData.data;
    dispatch({ type: GET_AUTORS, payload: autors });//... este info va al reducer

  };
};

export const updateDates = (dates) => {
  return async function (dispatch) {
    dispatch({ type: UPDATE_DATES, payload: dates })
  };
}

export const blockAccount = (id) => {
  return async function (dispatch) {
    dispatch({ type: BLOCK_ACCOUNT, payload: id })
  };
}

export const unBlockAccount = (id) => {
  return async function (dispatch) {
    dispatch({ type: UNBLOCK_ACCOUNT, payload: id })
  };
}

export const getAdvisorReviews = (id) => {
  return async function (dispatch) {
    const apiData = await axios.get(`${Server}/Advisors/${id}/Reviwers`);   // link2
    const reviews = apiData.data;
    dispatch({ type: GET_ADVISORS_REVIEWS, payload: reviews });

  };
};

export const getReviews = () => {
  return async function (dispatch) {
    const response = await axios.get(`${Server}/data/CommunityComments`);   // link2
    const reviews = response.data;
    dispatch({ type: GET_REVIEWS, payload: reviews });
  };
};

export const getAdvisors = () => {
  return async function (dispatch) {
    const response = await axios.get(`${Server}/Advisors`);     // link2
    const advisors = response.data;
    dispatch({ type: GET_ADVISORS, payload: advisors })
  };
};

export const getDetail = (id) => {
  return async function (dispatch) {
    const response = await axios.get(`${Server}/Advisors/${id}`);   // link2
    const advisor = response.data;
    dispatch({ type: ADVISOR_DETAIL, payload: advisor })
  }
}

export const getProfile = (id) => {
  return async function (dispatch) {
    const response = await axios.get(`${Server}/Advisors/${id}`);   // link2
    const advisor = response.data;
    dispatch({ type: GET_PROFILE, payload: advisor })
  }
}

export const getTechSkills = () => {
  return async function (dispatch) {
    const response = await axios.get(`${Server}/data/TechSkills`);  // link2
    const techSkills = response.data;
    dispatch({ type: GET_TECHSKILLS, payload: techSkills })
  }
}

export const loadProfessionals = () => {
  return function (dispatch) {
    fetch(`${Server}/Advisors`)         // link2
      .then(res => res.json())
      .then(data => dispatch({ type: LOAD_PROFESSIONALS, payload: data }));
  }
}

export const filterBySpecialty = (specialty) => {
  return {
    type: FILTER_BY_SPECIALTY,
    payload: specialty,
  };
};

export const filterByLanguage = (language) => {
  return {
    type: FILTER_BY_LANGUAGE,
    payload: language,
  };
};

export const filterByProgrammingLanguage = (programmingLanguages) => {
  return {
    type: FILTER_BY_PROGRAMMING_LANGUAGE,
    payload: programmingLanguages,
  };
};

export const filterByResidence = (countries) => {
  return {
    type: FILTER_BY_RESIDENCE,
    payload: countries,
  };
};

export const sortAdvisors = (method) => {
  return {
    type: SORT_ADVISORS,
    payload: method
  };
};

export const POST_REVIEW = 'POST_REVIWER';
export const DELETE_REVIWER = 'DELETE_REVIWER';
// export const PUT_SCORE = 'PUT_SCORE';


export function postReview(id, uid, photoUser, nameUser, Reviwer, score) {
  return async function (dispatch) {
    const tokken = window.localStorage.getItem("tokken");
    console.log(tokken)
    const json = await axios.post(`${Server}/Advisors/${id}/Reviwers`,          // link2
      {
        id,
        uid: uid,
        Img: photoUser,
        Name: nameUser,
        Reviwer: Reviwer.Reviwer,
        score: score,
        
      },          
      {
        headers: {
          authorization: "Bearer " + tokken,
        },
      }
    );
    return dispatch({
      type: POST_REVIEW,
      payload: json.data,
    });
  };
}

export const getCartItems = (id) => {
  return async function (dispatch){
    const cartData = await axios.get(`${localhost}/User/${id}`);   // back.vercel
    // console.log(cartData)
    const cartItems= cartData.data;
    dispatch({type: GET_CART_ITEMS, payload: cartItems})
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART
  };
};
// export function putScore(id, score) {
//   return async function (dispatch) {
//     console.log(id, score);
//     try {
//       const response = await axios.put(`https://code-advisor-xi.vercel.app/Advisors/${id}/Reviwers`, {
//         score: score,
//       });
//       dispatch({
//         type: PUT_SCORE,
//         payload: response.data,
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
// }

// export function deleteReviwer(id) {
//   try {
//     return async function (dispatch) {
//       const response = await axios.delete(`https://code-advisor-xi.vercel.app/Advisors/${id}/Reviwers/${id}`);
//       dispatch({
//         type: DELETE_REVIWER,
//         payload: response.data,
//       });
//     };
//   } catch (error) {
//     console.log(error.message);
//   }
// }
