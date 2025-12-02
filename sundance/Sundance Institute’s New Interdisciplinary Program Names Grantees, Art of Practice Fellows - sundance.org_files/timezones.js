"use strict";
/*

NOTE: daylight saving time is *not* observed in the following countries (by region):
* Europe
  Iceland

* North America and the Caribbean
  Cayman Islands, Jamaica, Puerto Rico, Trinidad and Tobago

* South America
  Colombia, Guyana, Peru, Venezuela

* Africa
  no countries observe DST, *except* for Canary Islands, Egypt, Namibia, Tunisia

* Asia
  Mongolia, China, Hong Kong, Macau, Korean Peninsula, Japan, Central Asian states,
  Nepal, Bhutan, Afghanistan, Iran, Kazakhstan, Kyrgyzstan, Pakistan, India, Bangladesh,
  Reof China (Taiwan), Myanmar, Thailand, Laos, Vietnam, Philippines, Cambodia,
  Malaysia, Brunei, Singapore, Indonesia, Timor Leste, Papua New Guinea,
  Saudi Arabia, Bahrain, Qatar

* Oceania
  no countries observe DST, *except* for Australia, New Zealand
  for Australia, see: http://www.bcl.com.au/times-daylight-saving.htm
  - New South Wales (Sydney), Victoria (Melbourne), South Australia (Adelaide), Tasmania (Hobart), Australian Capital Territory (Canberra)
    first Sunday in October through first Sunday in April
  - Western Australia (Perth) commenced a 3 year trial on 3rd December 2006, to be followed by a referendum in 2009
    last Sunday in October through last Sunday in March
  - Queensland (Brisbane): Eastern Standard Time all year
  - Northern Territory do not change their clocks

NOTE: other areas where daylight saving time is not observed
      are listed under each DST type within getDST()
'use strict';
NOTE: ONLY GOOD FOR 2008 because too complex to make general calculation:
* Israel
  start: last Friday before April 2
  end: the Sunday between Rosh Hashanah and Yom Kippur

*/


	// enum for weekdays used in firstWeekday() and lastWeekday()
	var SUN = 0;
	var MON = 1;
	var TUE = 2;
	var WED = 3;
	var THU = 4;
	var FRI = 5;
	var SAT = 6;


	// enum for countries/zones getDST()
	// Europe, Greenland, Russia, Canary Islands, Tunisia
	var EUROPE = 10;

	// USA, Canada
	var USA = 20;
	// Mexico uses old USA rules
	var MEXICO = 21;
	var GUATEMALA = 22;
	var CUBA = 23;

	var BRAZIL = 30;
	var CHILE = 31;
	var PARAGUAY = 32;
	var URUGUAY = 33;
	var ARGENTINA = 34;

	var EGYPT = 40;
	var NAMIBIA = 41;
	var MOROCCO = 42;

	var JORDAN = 50;
	var SYRIA = 51;
	var IRAQ = 52;
	var ISRAEL = 53;
	var PAKISTAN = 54;

	// Australia: New South Wales (Sydney), Victoria (Melbourne), South Australia (Adelaide), Tasmania (Hobart),
	//   Australian Capital Territory (Canberra)
	var AUSTRALIA = 60;
	// Australia: Western Australia (Perth)
	var AUSTRALIA_WESTERN = 61;
	var NEW_ZEALAND = 62;


	// prevent instantiation


	function TimezoneUtil() {}

	// NOTE: for all functions, "dst_type" is in base 10:
	//   +100 = GMT+0100 = UTC +1 hour, 0 minutes
	//   -1000 = GMT-1000 = UTC -10 hours, 0 minutes
	//   +530 = GMT+0530 = UTC +5 hours, 30 minutes
	// converts a "dst_type" number to its components: hours, minutes, and combined time in minutes
	// ex: +100 = hour: 1, minute: 0, minutes: 60
	// ex: -430 = hour: -4, minute: -30, minutes: -270


	function dstToComponents(dst_type) {
		var dst_obj = {
			hour: 0,
			minute: 0,
			minutes: 0
		};

		if (dst_type !== null) {
			var dst_hour = Math.floor(Math.abs(dst_type) / 100);
			if (dst_type < 0) {
				dst_hour = -dst_hour;
			}
			var dst_minute = dst_type % 100;
			var dst_minutes = dst_hour * 60 + dst_minute;

			dst_obj = {
				hour: dst_hour,
				minute: dst_minute,
				minutes: dst_minutes
			};
		}

		return dst_obj;
	}

	// returns the date (1..31) for the first weekday (0..6)
	// of the month (and year) given by reference date
	function firstWeekday(weekday, reference_date) {
		var first_weekday = null;

		if ((reference_date !== null) && (weekday !== null) && (weekday >= 0)) {
			weekday = weekday % 7;

			// create a Date for the first day of current month
			var test_date = new Date(reference_date.getFullYear(), reference_date.getMonth(), 1);

			var test_weekday = test_date.getDay();
			first_weekday = test_date.getDate();

			if (test_weekday !== weekday) {
				if (test_weekday > weekday) {
					test_weekday -= 7;
				}
				first_weekday -= (test_weekday - weekday);
			}
		}

		return first_weekday;
	}

	// returns the date (1..31) for the last weekday (0..6)
	// of the month (and year, important for leap days) given by reference date
	function lastWeekday(weekday, reference_date) {
		var last_weekday = null;

		if ((reference_date !== null) && (weekday !== null) && (weekday >= 0)) {
			weekday = weekday % 7;

			// create a Date for the last day of current month
			// (next month minus one day)
			var test_date = new Date(reference_date.getFullYear(), reference_date.getMonth() + 1, 0);

			var test_weekday = test_date.getDay();
			last_weekday = test_date.getDate();

			if (test_weekday !== weekday) {
				if (test_weekday < weekday) {
					test_weekday += 7;
				}
				last_weekday -= (test_weekday - weekday);
			}
		}

		return last_weekday;
	}

	// returns Daylight Savings Time offset (summer time)
	// 0 if not in DST
	// +0100 if in DST


	function getDST(reference_date, dst_type) {
		var dst = 0;
		var month = reference_date.getUTCMonth() + 1;
		var mday = reference_date.getUTCDate();
		switch (dst_type) {
		case "EUROPE":
			// Europe, Greenland, Russia, Canary Islands, Tunisia
			// start: last Sunday in March
			// end: last Sunday in October
			// time: 1 am (01:00) Greenwich Mean Time (GMT) (ignored)
			// Russia time: 2 am local time (ignored)
			if ((month > 3) && (month < 10)) {
				dst = +100;
			} else if ((month === 3) && (mday >= lastWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 10) && (mday < lastWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "USA":
			// USA, Canada
			// start: second Sunday in March at 02:00:00
			// end: first Sunday in November at 02:00:00
			// * not observed in U.S.: Arizona, Hawaii
			// * not observed in U.S territories: American Samoa, Guam, Puerto Rico, the U.S. Virgin Islands
			// * not observed in Canada: Saskatchewan, northeastern British Columbia and Southampton Island in Nunavut
			if ((month > 3) && (month < 11)) {
				dst = +100;
			} else if ((month === 3) && (mday >= firstWeekday(SUN, reference_date) + 7)) {
				dst = +100;
			} else if ((month === 11) && (mday < firstWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "MEXICO":
			// Mexico (old USA rules)
			// start: first Sunday in April at 02:00:00
			// end: last Sunday in October at 02:00:00
			// * not observed in: Sonora
			if ((month > 4) && (month < 10)) {
				dst = +100;
			} else if ((month === 4) && (mday >= firstWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 10) && (mday < lastWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "GUATEMALA":
			// Guatemala
			// no DST in 2007, 2008, 2010
			break;
		case "CUBA":
			// Cuba
			// start: second Sunday in March
			// end: last Sunday in October
			// time: 1 am local time (ignored)
			if ((month > 3) && (month < 10)) {
				dst = +100;
			} else if ((month === 3) && (mday >= firstWeekday(SUN, reference_date) + 7)) {
				dst = +100;
			} else if ((month === 10) && (mday < lastWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "BRAZIL":
			// Brazil
			// NOTE: starting and ending dates are variable - this is just an approximation!
			// start: third Saturday in October at 23:59:59
			// end: third Saturday in February at 23:59:59
			// * not observed in: Acre, Alagoas, Amapá, Amazonas, Bahia, Ceará, Maranhão, Pará, Paraíba, Pernambuco,
			//   Piauí, Rio Grande do Norte, Rondônia, Roraima, Sergipe, Tocantins
			if ((month > 10) || (month < 2)) {
				dst = +100;
			} else if ((month === 10) && (mday >= firstWeekday(SUN, reference_date) + 14)) {
				dst = +100;
			} else if ((month === 2) && (mday < firstWeekday(SUN, reference_date) + 14)) {
				dst = +100;
			}

			break;
		case "CHILE":
			// Chile
			// NOTE: in specific years the starting and ending dates have been modified for political or climatic reasons
			// start: second Sunday in October
			// end: first Sunday in April
			// time: midnight local time
			if ((month > 10) || (month < 4)) {
				dst = +100;
			} else if ((month === 10) && (mday >= firstWeekday(SUN, reference_date) + 7)) {
				dst = +100;
			} else if ((month === 4) && (mday < firstWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "PARAGUAY":
			// Paraguay
			// start: first Sunday in October at 00:00:00
			// end: second Sunday in April at 00:00:00
			if ((month > 10) || (month < 4)) {
				dst = +100;
			} else if ((month === 10) && (mday >= firstWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 4) && (mday < firstWeekday(SUN, reference_date) + 7)) {
				dst = +100;
			}

			break;
		case "URUGUAY":
			// Uruguay
			// start: first Sunday in October
			// end: second Sunday in March
			if ((month > 10) || (month < 3)) {
				dst = +100;
			} else if ((month === 10) && (mday >= firstWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 3) && (mday < firstWeekday(SUN, reference_date) + 7)) {
				dst = +100;
			}

			break;
		case "ARGENTINA":
			// Argentina
			// no DST in 2010
			break;
		case "EGYPT":
			// Egypt
			// start: last Friday in April at 00:00:00
			// end: first Friday in August at 00:00:00
			// NOTE! STARTING 2011... end: last Friday in September at 00:00:00
			if ((month > 4) && (month < 8)) {
				dst = +100;
			} else if ((month === 4) && (mday >= lastWeekday(FRI, reference_date))) {
				dst = +100;
			} else if ((month === 8) && (mday < firstWeekday(FRI, reference_date))) {
				dst = +100;
			}

			break;
		case "NAMIBIA":
			// Namibia
			// start: first Sunday in September
			// end: first Sunday in April
			if ((month > 9) || (month < 4)) {
				dst = +100;
			} else if ((month === 9) && (mday >= firstWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 4) && (mday < firstWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "MOROCCO":
			case 2020:
				if ((month < 4) || (month > 5)) {
					dst = +100;
				} else
				if ((month <= 4) && (mday <= 18)) {
					dst = +100;
				} else if ((month >= 5) && (mday >= 31)) {
					dst = +100;
				}
				break;
			case 2021:
				if ((month < 4) || (month > 5)) {
					dst = +100;
				} else
				if ((month <= 4) && (mday <= 10)) {
					dst = +100;
				} else if ((month >= 5) && (mday >= 16)) {
					dst = +100;
				}
				break;
		case "JORDAN":
			// Jordan
			// start: last Friday in March at 00:00:00
			// end: last Friday in October at 01:00:00
			if ((month > 3) && (month < 10)) {
				dst = +100;
			} else if ((month === 3) && (mday >= lastWeekday(FRI, reference_date))) {
				dst = +100;
			} else if ((month === 10) && (mday < lastWeekday(FRI, reference_date))) {
				dst = +100;
			}

			break;
		case "SYRIA":
			// Syria
			// start: first Friday in April at 00:00:00
			// end: last Friday in October at 00:00:00
			if ((month > 4) && (month < 10)) {
				dst = +100;
			} else if ((month === 4) && (mday >= firstWeekday(FRI, reference_date))) {
				dst = +100;
			} else if ((month === 10) && (mday < lastWeekday(FRI, reference_date))) {
				dst = +100;
			}

			break;
		case "IRAQ":
			// Iraq
			// no DST in 2010
			break;
		case "ISRAEL":
			// Israel
			// NOTE: ONLY GOOD FOR 2010 because too complex to make general calculation
			// start: last Friday before April 2 at 02:00:00
			// end: the Sunday between Rosh Hashanah and Yom Kippur at 02:00:00
			// 2010: starts 26 March, ends 12 September
			// 2011: starts 1 April, ends 2 October
			// 2012: starts 30 March, ends 23 September
			// 2013: starts 29 March, ends 8 September
			// 2014: starts 28 March, ends 28 September
			// 2015: starts 27 March, ends 20 September
			switch (reference_date.getUTCFullYear()) {
				// 2010: starts 26 March, ends 12 September
			case 2010:
				if ((month > 3) && (month < 9)) {
					dst = +100;
				} else if ((month === 3) && (mday >= 26)) {
					dst = +100;
				} else if ((month === 9) && (mday < 12)) {
					dst = +100;
				}
				break;
				// 2011: starts 1 April, ends 2 October
			case 2011:
				if ((month > 4) && (month < 10)) {
					dst = +100;
				} else if ((month === 4) && (mday >= 1)) {
					dst = +100;
				} else if ((month === 10) && (mday < 2)) {
					dst = +100;
				}
				break;
				// 2012: starts 30 March, ends 23 September
			case 2012:
				if ((month > 3) && (month < 9)) {
					dst = +100;
				} else if ((month === 3) && (mday >= 30)) {
					dst = +100;
				} else if ((month === 9) && (mday < 23)) {
					dst = +100;
				}
				break;
				// 2013: starts 29 March, ends 8 September
			case 2013:
				if ((month > 3) && (month < 9)) {
					dst = +100;
				} else if ((month === 3) && (mday >= 29)) {
					dst = +100;
				} else if ((month === 9) && (mday < 8)) {
					dst = +100;
				}
				break;
				// 2014: starts 28 March, ends 28 September
			case 2014:
				if ((month > 3) && (month < 9)) {
					dst = +100;
				} else if ((month === 3) && (mday >= 28)) {
					dst = +100;
				} else if ((month === 9) && (mday < 28)) {
					dst = +100;
				}
				break;
				// 2015: starts 27 March, ends 20 September
			case 2015:
				if ((month > 3) && (month < 9)) {
					dst = +100;
				} else if ((month === 3) && (mday >= 27)) {
					dst = +100;
				} else if ((month === 9) && (mday < 20)) {
					dst = +100;
				}
				break;
				// less-than-ideal fallback: starts last Friday in March, ends 20 September
			default:
				if ((month > 3) && (month < 9)) {
					dst = +100;
				} else if ((month === 3) && (mday >= lastWeekday(FRI, reference_date))) {
					dst = +100;
				} else if ((month === 9) && (mday < 20)) {
					dst = +100;
				}
				break;
			}

			break;
		case "PAKISTAN":
			// start: third Thursday in April at 00:00:00
			// end: first Monday in November at 00:00:00
			if ((month > 4) && (month < 11)) {
				dst = +100;
			} else if ((month === 4) && (mday >= firstWeekday(THU, reference_date) + 14)) {
				dst = +100;
			} else if ((month === 11) && (mday < firstWeekday(MON, reference_date))) {
				dst = +100;
			}

			break;
		case "AUSTRALIA":
			// Australia: New South Wales (Sydney), Victoria (Melbourne), South Australia (Adelaide), Tasmania (Hobart), Australian Capital Territory (Canberra)
			// start: first Sunday in October at 02:00:00
			// end: first Sunday in April at 03:00:00
			// * not observed in: Northern Territory, Queensland
			if ((month > 10) || (month < 4)) {
				dst = +100;
			} else if ((month === 10) && (mday >= firstWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 4) && (mday < firstWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		case "AUSTRALIA_WESTERN":
			// Australia: Western Australia (Perth)
			// no DST in 2010 (DST was only used for a trial period during the summers of 2006, 2007, 2008, 2009)
			break;
		case "NEW_ZEALAND":
			// New Zealand
			// start: last Sunday in September
			// end: first Sunday in April
			// time: 2 am local time (ignored)
			if ((month > 9) || (month < 4)) {
				dst = +100;
			} else if ((month === 9) && (mday >= lastWeekday(SUN, reference_date))) {
				dst = +100;
			} else if ((month === 4) && (mday < firstWeekday(SUN, reference_date))) {
				dst = +100;
			}

			break;
		}

		return dst;
	}
	// converts a Date object from one based in a given timezone to the local time
	// (pass zone_offset + dst_type that the date to convert uses)
	// ex: we're in Paris, 01 January 14:00 & -600 & USA => 21:00
	// ex: we're in Chicago, 01 January 14:00 & +100 & EUROPE => 07:00


	function foreignToLocal(base_date, zone_offset, dst_type) {
		var ofs_obj = dstToComponents(zone_offset + getDST(base_date, dst_type));
		//console.log(new Date(base_date.getTime() - ((base_date.getTimezoneOffset() + ofs_obj.minutes) * 60000)))
		return new Date(base_date.getTime() - ((base_date.getTimezoneOffset() + ofs_obj.minutes) * 60000));
	}

	// converts a Date object from the local time to one based in a given timezone
	// (pass zone_offset + dst_type for the region to convert the date to)
	// ex: we're in Paris, 01 January 14:00 & -600 & USA => 07:00
	// ex: we're in Chicago, 01 January 14:00 & +100 & EUROPE => 21:00


	function localToForeign(base_date, zone_offset, dst_type) {
		var ofs_obj = dstToComponents(zone_offset + getDST(base_date, dst_type));

		return new Date(base_date.getTime() + ((base_date.getTimezoneOffset() + ofs_obj.minutes) * 60000));
	}