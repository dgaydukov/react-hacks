'use strict';

/**
 * List of API functions
 */

import store from "../redux/store";
import axios from "axios";
import * as creators from "../redux/action-creators";


export const getUser = ()=>{
    setTimeout(()=>{
        store.dispatch(creators.getUserSuccess({id: 1}));
    }, 3000)
}