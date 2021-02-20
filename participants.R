packages <- c("httr", "RMySQL", "jsonlite", "data.table", "stringr")
suppressMessages(library(data.table))

if (length(setdiff(packages, rownames(installed.packages()))) > 0) {
  install.packages(setdiff(packages, rownames(installed.packages())))
}
options(warn=-1)
`%notin%` <- Negate(`%in%`)

library(httr)
library(RMySQL)
library(jsonlite)
library(data.table)
library(stringr)

output_folder <- "/media/sergey/Data/Upwork/Iain/pittask/Participants"

# Options ------------------------------------------------------------------
options(useFancyQuotes = FALSE)

# Struct ------------------------------------------------------------------

Parameters <- data.table(
  PIN = character(),
  complete = character(),
  date = character(), 
  calendar_time = character(),
  location = character(),
  commit = character(),
  version = character(),
  parameter_name = character(), 
  parameter_value = character()
)

Specs <- data.table(
  PIN = character(),
  complete = character(),
  date = character(), 
  calendar_time = character(),
  location = character(),
  commit = character(),
  version = character(),
  hardware = character(),
  screen_resolution = character(),
  viewport_size = character(),
  `OS(version)` = character(),
  `browser(version)` = character()
)

Demographics <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  timezone = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = character()
)

OCI_R <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = numeric()
)

MOVES <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

DASS <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = numeric()
)

ASRS5 <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

EAT_26 <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = character()
)

RAADS_14 <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

PHQ_9 <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = numeric()
)

GAD_7 <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = character()
)

ASRM <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = numeric()
)

PC_PTSD_5 <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = character()
)

PRIME_R <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

AUDIT <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

PGSI <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

YIAT <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

SmokingStatus <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

FTND <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = character()
)

ISI <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = numeric()
)

PID_5_BF <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = numeric(),
  response = numeric()
)

LSAS <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = numeric()
)

ICAR <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = character(),
  response_content = character()
)

SDS <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  response = character()
)

VVR <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  stage = character(),
  commit = character(),
  version = character(),
  block = character(),
  item = character(),
  food_item = character(),
  correct = character(),
  belief_strength = character()
)

FoodRatings <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  item = character(),
  pre_rating = character(),
  post_rating = character()
)

HungerRating <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  pre_rating = character(),
  post_rating = character()
)

ConsentFeedback <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),
  q_num = numeric(),
  q_text = character(),
  `Y/N` = character()
)

PavCondition <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  location = character(),
  commit = character(),
  version = character(),  
  Q = numeric(),
  response = character(),
  correct = character()
)

Recall <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  commit = character(),
  version = character(),
  location = character(),
  block = character(),  
  item = numeric(),
  response = character(),
  correct = character(),
  belief_strength = character()
)

Transfer_q <- data.table(
  PIN = character(),
  complete = character(),
  date = character(),
  calendar_time = character(),
  timestamp = numeric(),
  stage = character(),
  commit = character(),
  version = character(),
  location = character(),
  block = character(),  
  item = numeric(),
  stimulus = character(),
  belief_strength = character(),
  text = character()
)

# Geo ---------------------------------------------------------------------

getGeoInfoByIP <- function(ipList){
  non_local_countries <- c()
  non_local_timezones <- c()
  
  local_ips_to_skip <- c("127.0.0.1", "0.0.0.0")
  
  non_local_ips <- ipList[ipList %notin% local_ips_to_skip]
  non_local_ips_indices <- which(ipList %notin% local_ips_to_skip)
  
  ipBatches <- split(non_local_ips, rep(1:ceiling(length(non_local_ips)/100), each = 100)[1:length(non_local_ips)])
  
  # ip-api is limited by 15 batch requests per minute (with 100 ips for each request)
  
  for(i in 1:length(ipBatches)){
    if(i %% 15 == 0){
      for(sec in seq(65, 1)){
        cat("\r", paste("  Please, wait for a ", sec, " seconds"))
        flush.console()
        Sys.sleep(1)
      }
      cat("\n")
    }
    
    batch <- lapply(ipBatches[[i]], function(ip){
      str_c("{\"query\":\"", ip, "\"}")
    })
    
    json <- str_c("[", paste(batch, collapse = ","), "]")
    request <- POST("http://ip-api.com/batch?fields=country,timezone,status", body = json)
    
    stop_for_status(request)
    response <- content(request, "text")

    non_local_countries <- c(non_local_countries, fromJSON(response)$country)
    non_local_timezones <- c(non_local_timezones, fromJSON(response)$timezone)
  }
  
  all_countries <- rep("local", length(ipList))
  all_timezones <- rep("local", length(ipList))
  
  all_countries[non_local_ips_indices] <- non_local_countries
  all_timezones[non_local_ips_indices] <- non_local_timezones
  
  list("countries" = all_countries, "timezones" = all_timezones)
}

formatDateTime <- function(dateTime){
  as.POSIXct(dateTime/1000, origin = "1970-01-01")
}

# Connection --------------------------------------------------------------

connection = dbConnect(MySQL(), user = 'root', password='VolitionL101', dbname = 'pittask', host='127.0.0.1')

query <- tryCatch(
  dbSendQuery(connection, "SELECT * FROM turkdemo"),
  error = function(e){ "NA" })

# Processing --------------------------------------------------------------

if(isClass(query))
{
  data <- dbFetch(query, n = -1)
  recordsCount <- nrow(data)
  
  # Parsing non-empty trialdata events and counting CompleteData size
  
  data$datastring[is.na(data$datastring)] <- "{}"
  json_data <- purrr::map(data$datastring, fromJSON)
  
  complete_data_size <- 0
  complete_data_index <- 1L

  for(i in 1:recordsCount){
    
    if(length(json_data[[i]]) == 0 | is.null(json_data[[i]]$data$trialdata$events)) {
      next
    }
    
    temp_events <- json_data[[i]]$data$trialdata$events[!is.na(json_data[[i]]$data$trialdata$events)]
    
    for(j in 1: length(temp_events)) {
      complete_data_size <- complete_data_size + nrow(fromJSON(temp_events[j]))
    }
  }
  
  # Setting vectors sizes pre-allocates memory
  
  CompleteData <- data.table(
    PIN = character(complete_data_size),
    complete = character(complete_data_size),
    date = character(complete_data_size),
    calendar_time = character(complete_data_size),
    timestamp = character(complete_data_size),
    location = character(complete_data_size),
    timezone = character(complete_data_size),
    stage = character(complete_data_size),
    commit = character(complete_data_size),
    version = character(complete_data_size),
    block = character(complete_data_size),
    interval = character(complete_data_size),
    event_type = character(complete_data_size),
    event_raw = character(complete_data_size),
    event_converted = character(complete_data_size)
  )
  
  cat("\n  Processing IP addresses . . .\n")
  
  geoInfo <- getGeoInfoByIP(data$ipaddress)
  
  cat("\n  Processing data . . .\n")
  
  progressBar <- txtProgressBar(min = 0, max = recordsCount, style = 3, char = '|')
  
  for(i in 1:recordsCount) {
    if(length(json_data[[i]]) == 0){
      setTxtProgressBar(progressBar, i)
      next
    }
    
    dateTime <- formatDateTime(json_data[[i]]$data$dateTime)
    dateTime_ms <- json_data[[i]]$data$dateTime
    trialdata <- json_data[[i]]$data$trialdata
    
    PIN <- sQuote(str_pad(toString(i), 5, "left", pad = "0"))
    complete <- ifelse(is.na(data$endhit[i]), "n", "y")
    commit <- trialdata$commit[1]
    version <- trialdata$`counter-balancing version`[1]
    country <- geoInfo$countries[i]
    timezone <- geoInfo$timezones[i]

    # Parameters --------------------------------------------------------------
    
    parameters_index <- which(trialdata$stage_name %in% "Parameters")
    
    if(length(parameters_index ) != 0){
      parameters_response <- fromJSON(trialdata[parameters_index,]$parameters)
      
      date <- format(as.IDate(dateTime[parameters_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[parameters_index]))
      
      for(j in 1:length(parameters_response)){
        Parameters <- rbindlist(list(Parameters, list(
          PIN, complete, date, time,
          country, commit, version,
          names(parameters_response)[j],
          parameters_response[[j]]
        )))
      }
    }
    
    # Specs --------------------------------------------------------------

    specs_index <- which(trialdata$stage_name %in% "Parameters")
    
    if(length(specs_index ) != 0){
      specs <- fromJSON(trialdata[parameters_index,]$specs)
      date <- format(as.IDate(dateTime[specs_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[specs_index]))

      Specs <- rbindlist(list(Specs, list(
        PIN, complete, date, time,
        country, commit, version,
        specs[[3]], specs[[4]], specs[[5]], specs[[1]], specs[[2]]
      )))
    }
    
    # Demographics --------------------------------------------------------------------
    
    demographics_index <- which(trialdata$stage_name %in% "\"demographics\"")
    
    if(length(demographics_index) != 0){
      demographics_responses <- fromJSON(trialdata[demographics_index,]$responses)
      demographics_timestamps <- fromJSON(trialdata[demographics_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[demographics_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[demographics_index]))
      time_elapsed <- trialdata$time_elapsed[demographics_index]
      time_ms <- dateTime_ms[demographics_index] - time_elapsed

      for(j in 1:length(demographics_responses)){
        timestamp <- ifelse(is.na(names(demographics_timestamps)[j]), 'NA', demographics_timestamps[[j]])
        if(is.na(names(demographics_timestamps)[j])) timestamp <- names(demographics_timestamps)[j]

        Demographics <- rbindlist(list(Demographics, list(
          PIN, complete, date,
          ifelse(timestamp == 'NA', 'NA', as.character(as.ITime(formatDateTime(
            time_ms + as.numeric(if(timestamp != 'NA') timestamp))))),
          timestamp, country, timezone, commit, version,
          names(demographics_responses)[j],
          demographics_responses[[j]]
        )))
      }
    } 
    
    # OCI-R -------------------------------------------------------------------
    
    ocir_index <- which(trialdata$stage_name %in% "\"OCI-R\"")
    
    if(length(ocir_index) != 0){
      ocir_responses <- fromJSON(trialdata[ocir_index,]$responses)
      ocir_timestamps <- fromJSON(trialdata[ocir_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[ocir_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[ocir_index]))

      time_elapsed <- trialdata$time_elapsed[ocir_index]
      time_ms <- dateTime_ms[ocir_index] - time_elapsed
      
      for(j in 1:length(ocir_responses)){
        OCI_R <- rbindlist(list(OCI_R, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(ocir_timestamps[[j]])))),
          ocir_timestamps[[j]],
          country, commit, version,
          names(ocir_responses)[j],
          ocir_responses[[j]]
        )))
      }
    }
    
    # MOVES --------------------------------------------------------------------
    
    moves_index <- which(trialdata$stage_name %in% "\"MOVES\"")
    
    if(length(moves_index) != 0){
      moves_responses <- fromJSON(trialdata[moves_index,]$responses)
      moves_timestamps <- fromJSON(trialdata[moves_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[moves_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[moves_index]))

      time_elapsed <- trialdata$time_elapsed[moves_index]
      time_ms <- dateTime_ms[moves_index] - time_elapsed
      
      for(j in 1:length(moves_responses)){
        timestamp <- ifelse(is.na(names(moves_timestamps)[j]), 'NA', moves_timestamps[[j]])
        if(is.na(names(moves_timestamps)[j])) timestamp <- names(moves_timestamps)[j]
        
        MOVES <- rbindlist(list(MOVES, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(timestamp)))),
          timestamp, country, commit, version,
          names(moves_responses)[j],
          moves_responses[[j]]
        )))
      }
    }

    # DASS --------------------------------------------------------------------
    
    dass_index <- which(trialdata$stage_name %in% "\"DASS\"")
    
    if(length(dass_index) != 0){
      dass_responses <- fromJSON(trialdata[dass_index,]$responses)
      dass_timestamps <- fromJSON(trialdata[dass_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[dass_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[dass_index]))

      time_elapsed <- trialdata$time_elapsed[dass_index]
      time_ms <- dateTime_ms[dass_index] - time_elapsed
      
      for(j in 1:length(dass_responses)){
        DASS <- rbindlist(list(DASS, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(dass_timestamps[[j]])))),
          dass_timestamps[[j]],
          country, commit, version,
          names(dass_responses)[j],
          dass_responses[[j]]
        )))
      }
    }
    
    # ASRS-5 --------------------------------------------------------------------
    
    asrs5_index <- which(trialdata$stage_name %in% "\"ASRS-5\"")
    
    if(length(asrs5_index) != 0){
      asrs5_responses <- fromJSON(trialdata[asrs5_index,]$responses)
      asrs5_timestamps <- fromJSON(trialdata[asrs5_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[asrs5_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[asrs5_index]))

      time_elapsed <- trialdata$time_elapsed[asrs5_index]
      time_ms <- dateTime_ms[asrs5_index] - time_elapsed
      
      for(j in 1:length(asrs5_responses)){
        ASRS5 <- rbindlist(list(ASRS5, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(asrs5_timestamps[[j]])))),
          asrs5_timestamps[[j]],
          country, commit, version,
          names(asrs5_responses)[j],
          asrs5_responses[[j]]
        )))
      }
    }
    
    # EAT-26 --------------------------------------------------------------------
    
    eat26_index <- which(trialdata$stage_name %in% "\"EAT-26\"")
    
    if(length(eat26_index) != 0){
      eat26_responses <- fromJSON(trialdata[eat26_index,]$responses)
      eat26_timestamps <- fromJSON(trialdata[eat26_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[eat26_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[eat26_index]))
      
      time_elapsed <- trialdata$time_elapsed[eat26_index]
      time_ms <- dateTime_ms[eat26_index] - time_elapsed

      for(j in 1:length(eat26_responses)){
        EAT_26 <- rbindlist(list(EAT_26, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(eat26_timestamps[[j]])))),
          eat26_timestamps[[j]],
          country, commit, version,
          names(eat26_responses)[j],
          eat26_responses[[j]]
        )))
      }
    } 

    # RAADS-14 ----------------------------------------------------------------

    raads14_index <- which(trialdata$stage_name %in% "\"RAADS-14\"")
    
    if(length(raads14_index) != 0){
      raads14_responses <- fromJSON(trialdata[raads14_index,]$responses)
      raads14_timestamps <- fromJSON(trialdata[raads14_index,]$timestamp)

      time_elapsed <- trialdata$time_elapsed[raads14_index]
      time_ms <- dateTime_ms[raads14_index] - time_elapsed
      
      date <- format(as.IDate(dateTime[raads14_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[raads14_index]))
      
      for(j in 1:length(raads14_responses)){
        RAADS_14 <- rbindlist(list(RAADS_14, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(raads14_timestamps[[j]])))),
          raads14_timestamps[[j]],
          country, commit, version,
          names(raads14_responses)[j],
          raads14_responses[[j]]
        )))
      }
    } 
    
    # PHQ-9 -------------------------------------------------------------------
    
    phq9_index <- which(trialdata$stage_name %in% "\"PHQ-9\"")
    
    if(length(phq9_index) != 0){
      phq9_responses <- fromJSON(trialdata[phq9_index,]$responses)
      phq9_timestamps <- fromJSON(trialdata[phq9_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[phq9_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[phq9_index]))

      time_elapsed <- trialdata$time_elapsed[phq9_index]
      time_ms <- dateTime_ms[phq9_index] - time_elapsed
      
      for(j in 1:length(phq9_responses)){
        PHQ_9 <- rbindlist(list(PHQ_9, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(phq9_timestamps[[j]])))),
          phq9_timestamps[[j]],
          country, commit, version,
          names(phq9_responses)[j],
          phq9_responses[[j]]
        )))
      }
    }
    
    # GAD-7 -------------------------------------------------------------------
    
    gad7_index <- which(trialdata$stage_name %in% "\"GAD-7\"")
    
    if(length(gad7_index) != 0){
      gad7_responses <- fromJSON(trialdata[gad7_index,]$responses)
      gad7_timestamps <- fromJSON(trialdata[gad7_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[gad7_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[gad7_index]))

      time_elapsed <- trialdata$time_elapsed[gad7_index]
      time_ms <- dateTime_ms[gad7_index] - time_elapsed
      
      for(j in 1:length(gad7_responses)){
        GAD_7 <- rbindlist(list(GAD_7, list(
          PIN, complete, date, 
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(gad7_timestamps[[j]])))),
          gad7_timestamps[[j]],
          country, commit, version,
          names(gad7_responses)[j],
          gad7_responses[[j]]
        )))
      }
    }
    
    # ASRM --------------------------------------------------------------------
    
    asrm_index <- which(trialdata$stage_name %in% "\"ASRM\"")
    
    if(length(asrm_index) != 0){
      asrm_responses <- fromJSON(trialdata[asrm_index,]$responses)
      asrm_timestamps <- fromJSON(trialdata[asrm_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[asrm_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[asrm_index]))
      
      time_elapsed <- trialdata$time_elapsed[asrm_index]
      time_ms <- dateTime_ms[asrm_index] - time_elapsed

      for(j in 1:length(asrm_responses)){
        ASRM <- rbindlist(list(ASRM, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(asrm_timestamps[[j]])))),
          asrm_timestamps[[j]],
          country, commit, version,
          names(asrm_responses)[j],
          asrm_responses[[j]]
        )))
      }
    }
    
    # PC-PTSD-5 ---------------------------------------------------------------
    
    pc_ptsd_5_index <- which(trialdata$stage_name %in% "\"PC-PTSD-5\"")
    
    if(length(pc_ptsd_5_index) != 0){
      pc_ptsd_5_responses <- fromJSON(trialdata[pc_ptsd_5_index,]$responses)
      pc_ptsd_5_timestamps <- fromJSON(trialdata[pc_ptsd_5_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[pc_ptsd_5_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[pc_ptsd_5_index]))

      time_elapsed <- trialdata$time_elapsed[pc_ptsd_5_index]
      time_ms <- dateTime_ms[pc_ptsd_5_index] - time_elapsed
      
      for(j in 1:length(pc_ptsd_5_responses)){
        PC_PTSD_5 <- rbindlist(list(PC_PTSD_5, list(
          PIN, complete, date,
          ifelse(pc_ptsd_5_timestamps[[j]] == 'NA', 'NA', as.character(as.ITime(formatDateTime(
            time_ms + as.numeric(if(pc_ptsd_5_timestamps[[j]] != 'NA') pc_ptsd_5_timestamps[[j]]))))), 
          pc_ptsd_5_timestamps[[j]],
          country, commit, version,
          names(pc_ptsd_5_responses)[j],
          pc_ptsd_5_responses[[j]]
        )))
      }
    }
    
    # PRIME-R -----------------------------------------------------------------

    prime_r_index <- which(trialdata$stage_name %in% "\"PRIME-R\"")
    
    if(length(prime_r_index) != 0){
      prime_r_responses <- fromJSON(trialdata[prime_r_index,]$responses)
      prime_r_timestamps <- fromJSON(trialdata[prime_r_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[prime_r_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[prime_r_index]))
      
      time_elapsed <- trialdata$time_elapsed[prime_r_index]
      time_ms <- dateTime_ms[prime_r_index] - time_elapsed

      for(j in 1:length(prime_r_responses)){
        PRIME_R <- rbindlist(list(PRIME_R, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(prime_r_timestamps[[j]])))),
          prime_r_timestamps[[j]],
          country, commit, version,
          names(prime_r_responses)[j],
          prime_r_responses[[j]]
        )))
      }
    }
    
    # AUDIT --------------------------------------------------------------------
    
    audit_index <- which(trialdata$stage_name %in% "\"AUDIT\"")
    
    if(length(audit_index) != 0){
      audit_responses <- fromJSON(trialdata[audit_index,]$responses)
      audit_index_timestamps <- fromJSON(trialdata[audit_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[audit_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[audit_index]))

      time_elapsed <- trialdata$time_elapsed[audit_index]
      time_ms <- dateTime_ms[audit_index] - time_elapsed

      for(j in 1:length(audit_responses)){
        AUDIT <- rbindlist(list(AUDIT, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(audit_index_timestamps[[j]])))),
          audit_index_timestamps[[j]],
          country, commit, version,
          names(audit_responses)[j],
          audit_responses[[j]]
        )))
      }
    }
    
    # PGSI --------------------------------------------------------------------
    
    pgsi_index <- which(trialdata$stage_name %in% "\"PGSI\"")
    
    if(length(pgsi_index) != 0){
      pgsi_responses <- fromJSON(trialdata[pgsi_index,]$responses)
      pgsi_timestamps <- fromJSON(trialdata[pgsi_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[pgsi_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[pgsi_index]))
      
      time_elapsed <- trialdata$time_elapsed[pgsi_index]
      time_ms <- dateTime_ms[pgsi_index] - time_elapsed

      for(j in 1:length(pgsi_responses)){
        PGSI <- rbindlist(list(PGSI, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(pgsi_timestamps[[j]])))),
          pgsi_timestamps[[j]],
          country, commit, version,
          names(pgsi_responses)[j],
          pgsi_responses[[j]]
        )))
      }
    }
    
    # YIAT --------------------------------------------------------------------
    
    yiat_index <- which(trialdata$stage_name %in% "\"YIAT\"")
    
    if(length(yiat_index) != 0){
      yiat_responses <- fromJSON(trialdata[yiat_index,]$responses)
      yiat_timestamps <- fromJSON(trialdata[yiat_index,]$timestamp)
            
      date <- format(as.IDate(dateTime[yiat_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[yiat_index]))

      time_elapsed <- trialdata$time_elapsed[yiat_index]
      time_ms <- dateTime_ms[yiat_index] - time_elapsed

      for(j in 1:length(yiat_responses)){
        YIAT <- rbindlist(list(YIAT, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(yiat_timestamps[[j]])))),
          yiat_timestamps[[j]],
          country, commit, version,
          names(yiat_responses)[j],
          yiat_responses[[j]]
        )))
      }
    }
    
    # SmokingStatus --------------------------------------------------------------------
    
    SmokingStatus_index <- which(trialdata$stage_name %in% "\"smoking\"")
    
    if(length(SmokingStatus_index) != 0){
      SmokingStatus_responses <- fromJSON(trialdata[SmokingStatus_index,]$responses)
      SmokingStatus_timestamps <- fromJSON(trialdata[SmokingStatus_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[SmokingStatus_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[SmokingStatus_index]))

      time_elapsed <- trialdata$time_elapsed[SmokingStatus_index]
      time_ms <- dateTime_ms[SmokingStatus_index] - time_elapsed

      for(j in 1:length(SmokingStatus_responses)){
        SmokingStatus <- rbindlist(list(SmokingStatus, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(SmokingStatus_timestamps[[j]])))),
          SmokingStatus_timestamps[[j]],
          country, commit, version,
          names(SmokingStatus_responses)[j],
          SmokingStatus_responses[[j]]
        )))
      }
    } 
    
    # FTND --------------------------------------------------------------------
    
    ftnd_index <- which(trialdata$stage_name %in% "\"FTND\"")
    
    if(length(ftnd_index) != 0){
      ftnd_responses <- fromJSON(trialdata[ftnd_index,]$responses)
      ftnd_timestamps <- fromJSON(trialdata[ftnd_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[ftnd_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[ftnd_index]))

      time_elapsed <- trialdata$time_elapsed[ftnd_index]
      time_ms <- dateTime_ms[ftnd_index] - time_elapsed

      for(j in 1:length(ftnd_responses)){
        FTND <- rbindlist(list(FTND, list(
          PIN, complete, date,
          ifelse(ftnd_timestamps[[j]] == 'NA', 'NA', as.character(as.ITime(formatDateTime(
            time_ms + as.numeric(if(ftnd_timestamps[[j]] != 'NA') ftnd_timestamps[[j]]))))), 
          ftnd_timestamps[[j]],
          country, commit, version,
          names(ftnd_responses)[j],
          ftnd_responses[[j]]
        )))
      }
    } 

    # ISI ---------------------------------------------------------------------
    
    isi_index <- which(trialdata$stage_name %in% "\"ISI\"")
    
    if(length(isi_index) != 0){
      isi_responses <- fromJSON(trialdata[isi_index,]$responses)
      isi_timestamps <- fromJSON(trialdata[isi_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[isi_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[isi_index]))

      time_elapsed <- trialdata$time_elapsed[isi_index]
      time_ms <- dateTime_ms[isi_index] - time_elapsed

      for(j in 1:length(isi_responses)){
        ISI <- rbindlist(list(ISI, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(isi_timestamps[[j]])))),
          isi_timestamps[[j]],
          country, commit, version,
          names(isi_responses)[j],
          isi_responses[[j]]
        )))
      }
    } 
    
    # PID-5-BF ----------------------------------------------------------------
    
    pid5bf_index <- which(trialdata$stage_name %in% "\"PID-5-BF\"")
    
    if(length(pid5bf_index) != 0){
      pid5bf_responses <- fromJSON(trialdata[pid5bf_index,]$responses)
      pid5bf_timestamps <- fromJSON(trialdata[pid5bf_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[pid5bf_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[pid5bf_index]))

      time_elapsed <- trialdata$time_elapsed[pid5bf_index]
      time_ms <- dateTime_ms[pid5bf_index] - time_elapsed

      for(j in 1:length(pid5bf_responses)){
        timestamp <- ifelse(is.na(names(pid5bf_timestamps)[j]), 'NA', pid5bf_timestamps[[j]])
        PID_5_BF <- rbindlist(list(PID_5_BF, list(
          PIN, complete, date,
          # as.character(as.ITime(formatDateTime(time_ms + as.numeric(pid5bf_timestamps[[j]])))),
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(timestamp)))),
          timestamp,
          country, commit, version,
          names(pid5bf_responses)[j],
          pid5bf_responses[[j]]
        )), fill=TRUE)
      }
    } 
    
    # LSAS --------------------------------------------------------------------
    
    lsas_index <- which(trialdata$stage_name %in% "\"LSAS\"")
    
    if(length(lsas_index) != 0){
      lsas_responses <- fromJSON(trialdata[lsas_index,]$responses)
      lsas_timestamps <- fromJSON(trialdata[lsas_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[lsas_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[lsas_index]))
 
      time_elapsed <- trialdata$time_elapsed[lsas_index]
      time_ms <- dateTime_ms[lsas_index] - time_elapsed
     
      for(j in 1:length(lsas_responses)){
        LSAS <- rbindlist(list(LSAS, list(
          PIN, complete, date,
          as.character(as.ITime(formatDateTime(time_ms + as.numeric(lsas_timestamps[[j]])))),
          lsas_timestamps[[j]],
          country, commit, version,
          names(lsas_responses)[j],
          lsas_responses[[j]]
        )))
      }
    } 
    
    # ICAR --------------------------------------------------------------------

    icar_index <- which(trialdata$stage_name %in% "\"ICAR\"")
    
    if(length(icar_index) != 0){
      icar_responses <- fromJSON(trialdata[icar_index,]$responses)
      icar_timestamps <- fromJSON(trialdata[icar_index,]$timestamp)
      icar_response_id <- fromJSON(trialdata[icar_index,]$responseId)
    
      date <- format(as.IDate(dateTime[icar_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[icar_index]))
      
      for(j in 1:length(icar_responses)){
        ICAR <- rbindlist(list(ICAR, list(
          PIN, complete, date, time, 
          icar_timestamps[[j]],
          country, commit, version,
          names(icar_responses)[j],
          icar_response_id[[j]],
          icar_responses[[j]]
        )))
      }
    } 
    
    # SDS ---------------------------------------------------------------------
    
    sds_index <- which(trialdata$stage_name %in% "\"SDS\"")
    
    if(length(sds_index) != 0){
      sds_responses <- fromJSON(trialdata[sds_index,]$responses)
      sds_timestamps <- fromJSON(trialdata[sds_index,]$timestamp)
      
      date <- format(as.IDate(dateTime[sds_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[sds_index]))
 
      time_elapsed <- trialdata$time_elapsed[sds_index]
      time_ms <- dateTime_ms[sds_index] - time_elapsed
     
      for(j in 1:length(sds_responses)){
        timestamp <- ifelse(is.na(names(sds_timestamps)[j]), 'NA', sds_timestamps[[j]])
        if(is.na(names(sds_timestamps)[j])) timestamp <- names(sds_timestamps)[j]

        SDS <- rbindlist(list(SDS, list(
          PIN, complete, date,
          ifelse(timestamp == 'NA', 'NA', as.character(as.ITime(formatDateTime(
            time_ms + as.numeric(if(timestamp != 'NA') timestamp))))),
          timestamp, country, commit, version,
          names(sds_responses)[j],
          sds_responses[[j]]
        )))
      }
    }

    # VVR ---------------------------------------------------------------------
    vvr_stages <- trialdata$vvr_stage

    if(!is.null(vvr_stages)){
      
      for(j in 1:length(vvr_stages)){

        date <- format(as.IDate(dateTime[j]), "%d-%m-%Y")
        time <- as.character(as.ITime(dateTime[j]))

        if(!is.na(trialdata$vvr_stage[j])) {
          VVR <- rbindlist(list(VVR, list(
            PIN, complete, date, time,
            trialdata$timestamp[j], country,
            fromJSON(trialdata$vvr_stage[j]), commit, version,
            trialdata$block_number[j],
            trialdata$item_id[j],
            trialdata$food_item[j],
            trialdata$correct[j],
            trialdata$strength_of_belief[j]
          )))
        }
        
      }
    }
    
    # FoodRatings ------------------------------------------------------------

    food_ratings_indices <- which(
        trialdata$trial_type %in% "food-and-hunger-questions" &
        trialdata$food_item != "\"hunger\"")

    if(length(food_ratings_indices) != 0){
      food_ratings <- trialdata[food_ratings_indices,]   
      
      for(fr in 1:dim(food_ratings)[1]) {
        FoodRatings <- rbindlist(list(FoodRatings, list(
          PIN, complete,
          format(as.IDate(dateTime[food_ratings_indices[fr]]), "%d-%m-%Y"),
          format(as.ITime(dateTime[food_ratings_indices[fr]])),
          food_ratings$timestamp[fr], country, commit,
          version, fromJSON(food_ratings$food_item[fr]),
          ifelse(fromJSON(food_ratings$rating_status[fr]) == "pre-rating", fromJSON(food_ratings$rating[fr]), ""),
          ifelse(fromJSON(food_ratings$rating_status[fr]) == "post-rating", fromJSON(food_ratings$rating[fr]), "")
        )))
      }
    }
    
    # HungerRatings ---------------------------------------------------------
    
    hunger_rating_indices <- which(
        trialdata$trial_type %in% "food-and-hunger-questions" &
        trialdata$food_item == "\"hunger\"")
    
    if(length(hunger_rating_indices) != 0){
      hunger_ratings <- trialdata[hunger_rating_indices,]
      
      for(hr in 1:dim(hunger_ratings)[1]) {
        HungerRating <- rbindlist(list(HungerRating, list(
          PIN, complete,
          format(as.IDate(dateTime[hunger_rating_indices[hr]]), "%d-%m-%Y"),
          format(as.ITime(dateTime[hunger_rating_indices[hr]])),
          hunger_ratings$timestamp[hr], country, commit, version,
          ifelse(fromJSON(hunger_ratings$rating_status[hr]) == "pre-rating", fromJSON(hunger_ratings$rating[hr]), ""),
          ifelse(fromJSON(hunger_ratings$rating_status[hr]) == "post-rating", fromJSON(hunger_ratings$rating[hr]), "")
        )))
      }
    }
    
    # ConsentFeedback ---------------------------------------------------------

    consent_feedback_index <- which(trialdata$stage_name %in% "\"close_HIT_q\"")

    if(length(consent_feedback_index ) != 0){
      consent_feedback_responses <- fromJSON(trialdata[consent_feedback_index,]$responses)
      consent_feedback_timestamp <- fromJSON(trialdata[consent_feedback_index,]$timestamp)

      date <- format(as.IDate(dateTime[consent_feedback_index]), "%d-%m-%Y")
      time <- as.character(as.ITime(dateTime[consent_feedback_index]))

      for(j in 1:length(consent_feedback_responses)){
        
        ConsentFeedback <- rbindlist(list(ConsentFeedback, list(
          PIN, complete, date, time, consent_feedback_timestamp[[j]], country,
          commit, version,
          ifelse(j == 4, 3, j),
          names(consent_feedback_responses)[j] %>% str_replace("^\\d+ :", "") %>% str_trim(),
          consent_feedback_responses[[j]]
        )))
      }
    }

    # PavCondition ------------------------------------------------------------

    pav_condition_index <- which(trialdata$stage_type %in% "\"Pav Conditioning Response\"")
    
    if(length(pav_condition_index) != 0){
      pav_condition_responses <- trialdata[pav_condition_index,]$responses
      pav_condition_timestamp <- trialdata[pav_condition_index,]$timestamp
    
      for(j in 1:length(pav_condition_responses)){
        events <- trialdata[pav_condition_index,]
        response_submitted <- fromJSON(events$response_submitted[j])
        correct <- events$correct[j]
        
        date <- format(as.IDate(dateTime[j]), "%d-%m-%Y")
        time <- as.character(as.ITime(dateTime[j]))
    
        PavCondition <- rbindlist(list(PavCondition, list(
          PIN, complete, date, time, pav_condition_timestamp[j], country, commit, version, 
          j, response_submitted, substring(correct, 1, 1)
        )))
      }
    }
    
    # Recall -----------------------------------------------------------------

    recall_index <- which(trialdata$stage_name %in% "\"recall\"")

    if(length(recall_index) != 0){
      recall_block_number <- trialdata[recall_index,]$block_number
      recall_timestamp <- trialdata[recall_index,]$timestamp
      response_submitted <- trialdata[recall_index,]$response_submitted
      strength_of_belief <- trialdata[recall_index,]$strength_of_belief
      recall_correct <- trialdata[recall_index,]$correct

      for(j in 1:length(recall_block_number)){
        date <- format(as.IDate(dateTime[j]), "%d-%m-%Y")
        time <- as.character(as.ITime(dateTime[j]))

        Recall <- rbindlist(list(Recall, list(
          PIN, complete, date, time, recall_timestamp[j], commit, version, country, 
          recall_block_number[j], j, 
          ifelse(is.na(response_submitted[j]), "NA", fromJSON(response_submitted[j])),
          recall_correct[j],
          ifelse(is.na(strength_of_belief[j]), "NA", strength_of_belief[j])
        )))
      }

    }

    # Transfer_q --------------------------------------------------------------

    transfer_q_index <- which(trialdata$stage_name %in% "\"transfer_q\"")

    if(length(transfer_q_index) != 0){
      transfer <- trialdata[transfer_q_index,]
      transfer_q <- trialdata[transfer_q_index,]$stage_name
   
 
      for(j in 1:length(transfer_q)){
        date <- format(as.IDate(dateTime[j]), "%d-%m-%Y")
        time <- as.character(as.ITime(dateTime[j]))
      
        Transfer_q <- rbindlist(list(Transfer_q, list(
          PIN, complete, date, time, transfer$timestamp[j], fromJSON(transfer_q[j]), commit,
          version, country, "NA", transfer$item_id[j], fromJSON(transfer$stimulus[j]),
          fromJSON(transfer$strength_of_belief[j]), fromJSON(transfer$text[j])
        )))
      }
    }

    # CompleteData ------------------------------------------------------------
    
    if(!is.null(trialdata$stage_name) & !is.null(version) & !is.null(trialdata$events)) {
      for (j in 1:length(trialdata$events)) {
        if (!is.na(trialdata$events[j]) & trialdata$events[j] != "[]") {
          date <- format(as.IDate(dateTime[j]), "%d-%m-%Y")
          time <- as.character(as.ITime(dateTime[j]))
          events <- fromJSON(trialdata$events[j])
          
          time_elapsed <- trialdata$time_elapsed[j]
          time_ms <- dateTime_ms[j] - time_elapsed
          stage_name <- gsub('"', "", trialdata$stage_name[j])
          
          block_number <- ifelse(
            is.na(trialdata$block_number[j]) || 
            "block_number" %notin% colnames(trialdata), 
            'NA', trialdata$block_number[j])
          
          # set() method with pre-allocated memory is much faster than appending data row by row using rbindlist()
          
          for (e in 1:nrow(events)) {
            set(CompleteData, complete_data_index, 1L:15L, list(
              PIN, complete, format(as.IDate(formatDateTime(time_ms + events$timestamp[e])), "%d-%m-%Y"),
              as.character(as.ITime(formatDateTime(time_ms + events$timestamp[e]))),
              ifelse(is.na(events$timestamp[e]), 'NA', events$timestamp[e]),
              country, timezone, stage_name, commit, version,
              ifelse(stage_name != "transfer1" && stage_name != "transfer2" && stage_name != "transfer3", block_number, 
                ifelse(!is.na(events$block_number[e]), events$block_number[e], 'NA')
              ),
              ifelse(!is.null(events$interval_number[e]), events$interval_number[e], 'NA'),
              events$event_type[e],
              ifelse(is.null(events$event_raw_details[e]), NA, events$event_raw_details[e]),
              events$event_converted_details[e]
            ))
            
            complete_data_index <- complete_data_index + 1L
          }
        }
      }
    }
    
    setTxtProgressBar(progressBar, i)
  }
  
  close(progressBar)
  dbClearResult(query)
  dbDisconnect(connection)

  # Writing results ---------------------------------------------------------
  
  cat("\n  Saving results . . .\n")
  
  if(!dir.exists(output_folder))
    dir.create(output_folder)
  
  filesProgressBar <- txtProgressBar(min = 0, max = 6, style = 3, char = '|')
  
  results <- list(
    "parameters" = Parameters,
    "specs" = Specs,
    'demographics' = Demographics,
    "OCI-R" = OCI_R,
    "MOVES" = MOVES,
    "DASS" = DASS,
    "ASRS-5" = ASRS5,
    "EAT-26" = EAT_26,
    "RAADS-14" = RAADS_14,
    "PHQ-9" = PHQ_9,
    "GAD-7" = GAD_7,
    "ASRM" = ASRM,
    "PC-PTSD-5" = PC_PTSD_5,
    "PRIME-R" = PRIME_R,
    "AUDIT" = AUDIT,
    "PGSI" = PGSI,
    "YIAT" = YIAT,
    "smoking_status" = SmokingStatus,
    "FTND" = FTND,
    "ISI" = ISI,
    "PID-5-BF" = PID_5_BF,
    "LSAS" = LSAS,
    "ICAR" = ICAR,
    "SDS" = SDS,
    "VVR" = VVR,
    "food_ratings" = FoodRatings,
    "hunger_rating" = HungerRating,
    "consent_feedback" = ConsentFeedback,
    "pav_con" = PavCondition,
    "recall" = Recall,
    "transfer_q" = Transfer_q,
    "complete" = CompleteData
  )
  
  for (i in 1:length(results)) {
    if(nrow(results[[i]]) != 0){
      fwrite(results[[i]], str_c(output_folder, "//", names(results)[i], ".csv"), quote = "auto")
    }
    
    setTxtProgressBar(filesProgressBar, i)
  }
} else {
  print("Invalid database connection or query")
  dbDisconnect(connection)
}
