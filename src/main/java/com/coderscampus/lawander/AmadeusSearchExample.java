package com.coderscampus.lawander;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.FlightOfferSearch;

public class AmadeusSearchExample {

    public static void main(String[] args) {

        try {
            // Create an Amadeus client
            Amadeus amadeus = Amadeus
                    .builder("I2HFd9Ugsu2Wdcum6o0eaOnSvXhynYWy", "vBc1rqFrS57glP9n")
                    .build();

            // Search for flights
            FlightOfferSearch[] flightOffers = amadeus.shopping.flightOffersSearch.get(
                    Params.with("originLocationCode", "LAX")
                            .and("destinationLocationCode", "VNO")
                            .and("departureDate", "2024-12-25")
                            .and("returnDate", "2025-01-01")
                            .and("adults", "1")
            );

            // Print the first flight offer
            System.out.println(flightOffers[0]);

        } catch (ResponseException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}



//
//// How to install the library at https://github.com/amadeus4dev/amadeus-java
//import com.amadeus.Amadeus;
//import com.amadeus.Params;
//import com.amadeus.exceptions.ResponseException;
//import com.amadeus.resources.Destination;
//
//
//
//// What are the destinations served by the British Airways (BA)?
//public class AirlineRoutes {
//    public static void main(String[] args) throws ResponseException {
//
//        Amadeus amadeus = Amadeus
//                .builder("I2HFd9Ugsu2Wdcum6o0eaOnSvXhynYWy", "vBc1rqFrS57glP9n")
//                .build();
//
//        // Set query parameters
//        Params params = Params
//                .with("airlineCode", "BA");
//
//        // Run the query
//        Destination[] destinations = amadeus.airline.destinations.get(params);
//
//        if (destinations[0].getResponse().getStatusCode() != 200) {
//            System.out.println("Wrong status code: " + destinations[0].getResponse().getStatusCode());
//            System.exit(-1);
//        }
//
//        System.out.println("*****************************************************************************");
//
//
//        System.out.println(destinations[0]);
//    }
//}
