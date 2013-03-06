function Group () {
    this.wine = false
    this.reductions = false
    this.extras = false
    this.carryout = false
    this.nickname = ''
    this.peopleInParty = 0
    this.foodTotal = 0
    this.wineTotal = 0
    this.carryOutTotal = 0
    this.reductionTotal = 0
    this.tipTotal = 0
    this.total = 0
    this.taxTotal = 0
}

var groups = [new Group()]

var Gozintas = {
	numGroups : 0,
	billPath : 'split-bill',
	splitBy : 'individual',
	peopleInParty : 0,
	billModifier : { /* If any of the groups have wine, reductions, or extras, these will be set to true. If none of them have wine, reductions, or extras, these will be set to false. Also defined on a per group basis above in the groups variable*/
		wine : false,
		reductions : false,
		extras : false
	},
	total : {       /* Used to store the tax and amount from page two, and calculate the "reduced" price to divide by the group, taking into account reductions */
		withoutReduction : 0,
		taxAmount : 0,
		amount : 0
	},
	individual : {  /* Defines the amount per individual that should be paid in a party*/
		total : 0.00, /*total amount per individual*/
		tax : 0.00,   /*tax amount per individual*/
		tip : 0.00    /*tip amount per individual*/
	},
	tip : {         /* Defines the separate tip rates */
		general : 0.15,  /*percent, used for food tip and drink/desert/etc tip*/
		wine : 0.15,     /*percent, used for wine tip*/
		carryout : 0.15, /*percent, used for carryout tip*/
		tax : 0.15       /*percent, used for tax tip*/
	},
	calculateTip: function(){
		/* Calculates the tip for a group by taking all the different food totals (wine, food/drink, carryout) and multiplying by their percentage tip (.1, .3, etc). So the calculation is FoodTotal*FoodTipRate + WineTotal*WineTipRate + CarryTotal*CarryTipRate = total tip amount for group*/
		if(groups.length == 1){
			return parseFloat(+groups[0].foodTotal*Gozintas.tip.general + +groups[0].wineTotal*Gozintas.tip.wine + +groups[0].carryOutTotal*Gozintas.tip.carryout + +Gozintas.total.taxAmount*Gozintas.tip.tax)
		}else{
			return parseFloat(+this.tipAmount * (+this.total.amount)).toFixed(2)
		}
	},
	calculateTipIndividual: function(){
		/*Takes calculateTip above and divides it by the number of people in the groups party*/
		if(groups.length == 1){
			return parseFloat(this.calculateTip()/(+groups[0].peopleInParty)).toFixed(2)
		}else{
			return 0
		}
	},
	calculateTotal: function(){
		if((this.billPath == "split-bill" && this.splitBy == "individual") || this.billPath == "determine-tip"){
			return parseFloat(+this.total.amount + +this.calculateTip()).toFixed(2)
		}else{

		}	
	},
	calculateTotalIndividual: function(){
		if(groups.length ==1){
			return parseFloat(+this.calculateTotal()/(+groups[0].peopleInParty)).toFixed(2)
		}else{
			return 0
		}
	},
	calculatePeopleInParty: function(){
		Gozintas.peopleInParty = 0;
	    for(var i=0; i<groups.length; i++){
	        Gozintas.peopleInParty = +Gozintas.peopleInParty + groups[i].peopleInParty;
	    }
	},
	calculateTotalWithoutReduction: function(){
		Gozintas.total.withoutReduction = Gozintas.total.amount
        for(var i=0; i<groups.length; i++){
            if(groups[i].extras){
                Gozintas.total.withoutReduction = (+Gozintas.total.withoutReduction - +groups[i].foodTotal).toFixed(2)
            }
            if(groups[i].carryout){
                Gozintas.total.withoutReduction = (+Gozintas.total.withoutReduction - +groups[i].carryOutTotal).toFixed(2)
            }
            if(groups[i].wine){
                Gozintas.total.withoutReduction = (+Gozintas.total.withoutReduction - +groups[i].wineTotal).toFixed(2)
            }
        }
	},
	calculateTaxAndTotal: function(){
	    for(var i=0; i<groups.length; i++){
	        var totalAddition = 0
	        if(groups[i].extras){
	            totalAddition = totalAddition + +groups[i].foodTotal
	        }
	        if(groups[i].carryout){
	            totalAddition = totalAddition + +groups[i].carryOutTotal
	        }
	        if(groups[i].wine){
	            totalAddition = totalAddition + +groups[i].wineTotal
	        }
	        groups[i].total = (+Gozintas.individual.total * +groups[i].peopleInParty + +totalAddition).toFixed(2)
	        groups[i].taxTotal = (+Gozintas.individual.tax * +groups[i].peopleInParty).toFixed(2)
	    }
	},
	splitBillPath : function() {
		this.billPath = 'split-bill';
		$("body").addClass('split-class').removeClass('tip-class');
	},
	determineTipPath :  function() {
		this.billPath = 'determine-tip';
		$("body").addClass('tip-class').removeClass('split-class');
	},
	isOnSplitBillPath : function() {
		return this.billPath == 'split-bill'
	},
	isOnDetermineTipPath : function(){
		return this.billpath == 'determine-tip'
	},
	splitByIndividual : function() {
		this.splitBy = 'individual'
        groups.length = 1
        var new_group = new Group();
        new_group.peopleInParty = 1;
        groups[0] = new_group;
	},
	splitByGroup : function(group_num) {
		this.splitBy = 'group'
		this.group_num = group_num
	},
	isSplitingByIndividual : function(){
		return this.splitBy == 'individual'
	},
	isSplitingByGroup : function(){
		return this.splitPath == 'group'
	},
	showSplitTipButtons : function(){
	    if(this.isOnSplitBillPath()){
	        showButton = ".links-split";
	        hideButton = ".links-tip";
	    }else{
	        showButton = ".links-tip";
	        hideButton = ".links-split";
	    }
	    $(showButton).show();
	    $(hideButton).hide();
	},
	showPageFourButton: function(){
        if(this.isSplitingByIndividual()){
            $("#next_button_page4").attr("href", "#page4b");
        }else{
            $("#next_button_page4").attr("href", "#page4")
        }
	},
	showPageFourPercentages: function(){
		if(Gozintas.splitBy == "individual"){
			if(groups[0].wine){
	            $("#page3 #wine_tip").show();
	        }else{
	        	$("#page3 #wine_tip").hide();
	        }
	        if(groups[0].carryout){
	            $("#page3 #carry_tip").show();
	        }else{
	        	$("#page3 #carry_tip").hide();
	        }
		}else{
			if(Gozintas.splitBy == "group"){
				wineCount = 0
				carryoutCount = 0
				extraCount = 0
				for(var i = 0; i<groups.length; i++){

					if(groups[i].wine){
						wineCount = wineCount + 1
					}
					if(groups[i].carryout){
						carryoutCount = carryoutCount + 1
					}
					if(groups[i].extras){
						extraCount = extraCount + 1
						Gozintas.billModifier.extras = true
					}

				}

				if(wineCount > 0 ){
					Gozintas.billModifier.wine = true
		            $("#page3 #wine_tip").show();
		        }else{
		        	$("#page3 #wine_tip").hide();
		        }
		        if(carryoutCount > 0){
		            $("#page3 #carry_tip").show();
		        }else{
		        	$("#page3 #carry_tip").hide();
		        }
		    }
		}


	},
	showPageFiveBInputs: function(){
        /*$("#page4b input#individuals_in_party").val(groups[0].peopleInParty);
        $("#page4b input#food_total").val("$"+groups[0].foodTotal);
        $("#page4b input#wine_total").val("$"+groups[0].wineTotal);
        $("#page4b input#carryout_total").val("$"+groups[0].carryOutTotal);
        $("#page4b .food_total label").text("Food Total ("+(Gozintas.tip.general*100).toFixed()+"% tip rate)")
        $("#page4b .wine_total label").text("Wine Total ("+(Gozintas.tip.wine*100).toFixed()+"% tip rate)")
        $("#page4b .carryout_total label").text("Carry-out Total ("+(Gozintas.tip.carryout*100).toFixed()+"% tip rate)")
        $("#page4b .tax_total label").text("Tax ("+(Gozintas.tip.tax*100).toFixed()+"% tip rate)")
        $("#page4b input#tax_total").val("$"+Gozintas.total.taxAmount);

        $("#page4b input#tip_total").val("$"+Gozintas.calculateTip());
        $("#page4b input#total").val("$"+Gozintas.calculateTotal());
        $("#page4b input#tip_individual").val("$"+Gozintas.calculateTipIndividual());
        $("#page4b input#total_individual").val("$"+Gozintas.calculateTotalIndividual());*/


        $("#page4b span#individuals_in_party").text(groups[0].peopleInParty);
        $("#page4b span#food_total").text("$"+groups[0].foodTotal);
        $("#page4b span#wine_total").text("$"+groups[0].wineTotal);
        $("#page4b span#carryout_total").text("$"+groups[0].carryOutTotal);
        $("#page4b .food_total label").text("Bill Total ("+(Gozintas.tip.general*100).toFixed()+"% tip rate)")
        $("#page4b .wine_total label").text("Wine Total ("+(Gozintas.tip.wine*100).toFixed()+"% tip rate)")
        $("#page4b .carryout_total label").text("Carry-out Total ("+(Gozintas.tip.carryout*100).toFixed()+"% tip rate)")
        $("#page4b .tax_total label").text("Tax ("+(Gozintas.tip.tax*100).toFixed()+"% tip rate)")
        $("#page4b span#tax_total").text("$"+Gozintas.total.taxAmount);

        $("#page4b span#tip_total").text("$"+Gozintas.calculateTip());
        $("#page4b span#total").text("$"+Gozintas.calculateTotal());
        $("#page4b span#tip_individual").text("$"+Gozintas.calculateTipIndividual());
        $("#page4b span#total_individual").text("$"+Gozintas.calculateTotalIndividual());




		if(Gozintas.splitBy == "individual"){
			if(Gozintas.billPath == "determine-tip")
	        {
	        	$("#page4b .determine_tip").show();
	        	$("#page4b .wine_total").hide();
	        	$("#page4b .carryout_total").hide();
	        	$(".ui-grid-a-bill").hide();

	        }else{
	        	if(groups[0].wine){
	        		$("#page4b .wine_total").show();
	        	}else{
	        		$("#page4b .wine_total").hide();
	        	}
				if(groups[0].carryout){
					$("#page4b .carryout_total").show();
				}else{
					$("#page4b .carryout_total").hide();
				}
	        	$(".page5.determine_tip").hide();
	        	$(".ui-grid-a-bill").show();
	        }
		}
        if(!Gozintas.billModifier.wine){
            $(".page5.wine_tip").hide();
            $(".page5.wine").hide();
        }
        if(!Gozintas.billModifier.reductions){
            $(".page5.reductions").hide();
        }
        if(!Gozintas.billModifier.extras){
            $(".page5.extras").hide();
        }

        
	},

	reset: function(){
		Gozintas.billPath = "split-bill";
		Gozintas.splitBy = 'individual';
		Gozintas.peopleInParty = 0;
		Gozintas.billModifier.wine = false;
		Gozintas.billModifier.reductions = false;
		Gozintas.billModifier.extras = false;
		Gozintas.total.withoutReduction = 0;
		Gozintas.total.taxAmount = 0;
		Gozintas.total.amount = 0;
		Gozintas.individual.total = 0.00;
		Gozintas.individual.tax = 0.00;
		Gozintas.individual.tip = 0.00;
		Gozintas.tip.general = 0.15;
		Gozintas.tip.wine = 0.15;
		Gozintas.tip.carryout = 0.15;
		Gozintas.tip.tax = 0.15;

		group_size_to_delete = $("#page2 .group-container").size()
		for(var i = 0; i < group_size_to_delete; i++){
			$("#page2 .group-container").remove();
		}
		delete groups;
		addGroup();

	},

	showPageFiveGroupInputs: function(group_number){
        if(groups[group_number].wine){
            $("#page4 #group-"+(group_number+1)+" #wine_amount_container").show()
            $("#page4 #group-"+(group_number+1)+" #wine_amount").val(groups[group_number].wineTotal)
        }else{
            $("#page4 #group-"+(group_number+1)+" #wine_amount_container").hide()
        }
        if(groups[group_number].carryout){
            $("#page4 #group-"+(group_number+1)+" #carry_out_amount_container").show()
            $("#page4 #group-"+(group_number+1)+" #carry_out_amount").val(groups[group_number].carryOutTotal)
        }else{
            $("#page4 #group-"+(group_number+1)+" #carry_out_amount_container").hide()
        }
        if(groups[group_number].extras){
            $("#page4 #group-"+(group_number+1)+" #drinks_deserts_amount_container").show()
            $("#page4 #group-"+(group_number+1)+" #drinks_deserts_amount").val(groups[group_number].foodTotal)
        }else{
            $("#page4 #group-"+(group_number+1)+" #drinks_deserts_amount_container").hide()
        }

	},
	setBillModifierBooleans : function(){
		if(groups[0].extras == true){
			Gozintas.billModifier.extras = true
		}

		if(groups[0].wine == true){
			Gozintas.billModifier.wine = true
		}
	},
	handleKeyups: function(page){
		if(page == 3){
			var three_classes = [{id: "#group_nickname", input:"text", attribute:"nickname"},{id:"#people_in_group", input:"integer", attribute:"peopleInParty"},{id:"#drinks_deserts_etc",input:"money", attribute:"foodTotal", bool:"extras"},{id:"#wine_amount",input:"money", attribute:"wineTotal", bool:"wine"},{id:"#carry_out_amount",input:"money", attribute:"carryOutTotal", bool:"carryout"},{id:"#fair_reduction",input:"money", attribute:"reductionTotal", reduction:"reductions"}]
			$.each(three_classes, function(index, value) { 
				$("#page2 "+value["id"]).live("pageshow keyup",function(){
	            	group = $(this).parent().parent().parent().attr("class").split(" ")[0]
	            	parentClass = "#"+group+" ";
		            groupNum = parseFloat(group.split("-")[1])
		            if(value["input"] == "text"){
		            	input = $(parentClass+value["id"]).val();
		            	if(input.length == 0){
		            		input = "Group "+groupNum
		            	}
		            	store = "groups["+(groupNum-1)+"]."+value["attribute"]+" = '"+input+"'"
		            }
		            else if(value["input"] == "integer"){
		            	input = $(parentClass+value["id"]).val()
		            	if(input.length == 0){ 
		            		input = 0
		            	}else{
		            		input = parseFloat($(parentClass+value["id"]).val()).toFixed();
		            	}
		            	if( isNaN(input) || input == 0){
	                        $(".buttons").children().addClass('ui-disabled');
	                    }else{
	                        $(".buttons").children().removeClass('ui-disabled');
	                    }
		            	store = "groups["+(groupNum-1)+"]."+value["attribute"]+" = "+input
		            }else if(value["input"] == "money"){
		            	input = $(parentClass+value["id"]).val()

		            	if(input.length == 0){ 
		            		input = 0
		            		bool = "groups["+(groupNum-1)+"]."+value["bool"]+" = false"
		            	}else{
		            		input = parseFloat($(parentClass+value["id"]).val()).toFixed(2);
		            		if(input <=0){
		            			bool = "groups["+(groupNum-1)+"]."+value["bool"]+" = false"
		            		}else{
		            			bool = "groups["+(groupNum-1)+"]."+value["bool"]+" = true"
		            		}
		            	}
						store = "groups["+(groupNum-1)+"]."+value["attribute"]+" = "+input
						eval(bool)
		            }

		            eval(store)

		            if(value["id"] == "#group_nickname"){
		            	elToRemove = $("#page2 "+parentClass+"h3 span.ui-btn-text");
			            final_elToRemove = $("#page4 "+parentClass+"h3 span.ui-btn-text");
			            if(final_elToRemove.length == 0){
			                final_elToRemove = $("#page4 "+parentClass+"h3");
			            }
			            children = elToRemove.children().detach();
			            finalChildren = final_elToRemove.children().detach();
			            elToRemove.html(input);
			            final_elToRemove.html(input);
			            elToRemove.append(children);
			            final_elToRemove.append(finalChildren);
		            }

	        	});
			});
		}
	},

	clearEntry:  function(){
		console.log($(this).attr("class"));
	}


}
