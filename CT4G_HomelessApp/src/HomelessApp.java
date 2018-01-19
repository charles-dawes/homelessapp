import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Scanner;

public class HomelessApp {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		ArrayList<String>dailyItemsNamesArray = new ArrayList<>();
		ArrayList<Double>dailyItemsAmountsArray = new ArrayList<>();
		double dailyTotal = 0.0;
		String choice = "y";
		
		while(choice.equalsIgnoreCase("y")) {	
		System.out.print("Enter an item (daily): ");
		String itemStr = sc.next();
		dailyItemsNamesArray.add(itemStr);
		
		System.out.print("Enter the price of "+itemStr+": ");
		double dailyItem = sc.nextDouble();
		dailyItemsAmountsArray.add(dailyItem);
		
		System.out.print("Do you need to enter another item today: ");		
		choice = sc.next();
		System.out.println();
		}
		
		for(int i = 0; i < dailyItemsAmountsArray.size(); i++) {
			System.out.println("List of items and cost for today:");
			System.out.println("Item: " + dailyItemsNamesArray.get(i)
						  + ", Price: " + dailyItemsAmountsArray.get(i));
			dailyTotal += dailyItemsAmountsArray.get(i);
		}
		NumberFormat currency = NumberFormat.getCurrencyInstance();
		
		System.out.println("Today's daily total is: " + currency.format(dailyTotal));	
		sc.close();
	}

}
