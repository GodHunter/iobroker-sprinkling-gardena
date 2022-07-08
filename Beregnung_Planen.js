const pfad  = "0_userdata.0.Beregnung.Garten.";
const debug = true;

const niederschlagsmenge = Number( 2 );
const niederschlag = "0_userdata.0.Systemdaten.Wetter.d0.Niederschlagsmengein24h";

schedule("30 2 * * *", main);

function main(){

    if( debug ) log('-== STARTE BEWÄSSERUNGS-PLANUNG ==-');

    if( getState( pfad +'Allgemein.Automatik' ).val === true ){

        var selector = $('state[state.id='+ pfad +'Verteiler.*.NaechsteBeregnung]');    
        selector.each(function (obj, index) {
            
            var objekt = obj.split(/\.(?=[^\.]+$)/);
            var position = Number( objekt[0].slice(-1) );
            var aktiv = getState( objekt[0] +'._Aktiv' ).val;
            
            
            //Bei Regen zurücksetzen
            if( Number( getState( niederschlag ).val ) >= niederschlagsmenge && aktiv ){

                if( debug ) log('Setze Bereich '+ position +' wegen Regen zurück.');
                setState( obj, Number( getState( objekt[0] +'.Intervall' ).val ), true );

            } else if( aktiv ) {

                //Beregnung bei erreichen des Intervalles einplanen
                if( Number( getState(obj ).val -1 ) === 0 ){
                    
                    if( debug ) log('Plane Beregnung für den Bereich '+ position +' ein.'); 
                    setState( obj, Number( getState( obj ).val -1 ), true );
                    setState( objekt[0] +'._Warte', true, true);
                
                } else { //Nächste Beregnung runterzählen

                    if( debug ) log('Beregnung für den Bereich '+ position +' startet in '+ Number( getState( obj ).val -1 ) +' Tagen.');
                    setState( obj, Number( getState( obj ).val -1 ), true );

                }

            }

        })

    }

    if( debug ) log('-== ENDE BEWÄSSERUNGS-PLANUNG ==-');

}

//Beregnung zurücksetzen bei Automatik aus
$( 'state[state.id='+ pfad +'Allgemein.Automatik]' ).on( function (obj) {

    if( getState( obj.id ).val === false ){

        var selector    = $( 'state[state.id='+ pfad +'Verteiler.*.NaechsteBeregnung]' );

        selector.each(function (obj, i) {
            
            var objekt = obj.split(/\.(?=[^\.]+$)/);
            setState( obj, getState( objekt[0] +'.Intervall' ).val, true );
            setState( objekt[0] +'._Warte', false, true );

        });

    }
    
});

//Bei Veränderung des Intervalls
$('state[state.id='+ pfad +'Verteiler.*.Intervall]').on( function (obj) {

    var objekt = obj.id.split(/\.(?=[^\.]+$)/);
    if( getState( obj.id ).val < getState( objekt[0] +'.NaechsteBeregnung' ).val) setState( objekt[0] +'.NaechsteBeregnung', getState( obj.id ).val, true );

});
