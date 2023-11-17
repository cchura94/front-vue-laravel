// Whatsapp cloud Api
import axios from 'axios'

const urlBaseMeta = "https://graph.facebook.com/v17.0/106430075725576"

export function Meta(){
    let token = "EAAPM9CYi6YABO03s20ogsWJyb0Urpe9UZCcuRMAYW2ZBNf2vAqmyYAxr5xLNeCD97lOVVehl0hwMEq8MNu8hKgmbBZCHYU6M4YAkKTrZCQSgslwvxzYBYYocFHwAukmIMlM5ZB6ebZCxuln0AlpGbjjWEENAybpCqVG4zieCqd8pYnzfIQwVLOxigWaJkBIq6LPZCrKR3HFOE6fOitZBZA2EZD"

    const api = axios.create({
        baseURL: urlBaseMeta,
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    });

    return api;
}