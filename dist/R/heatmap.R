library(jsonlite)
library(heatmaply)
args = commandArgs(trailingOnly=TRUE)
targetoutpath = "output/"

all <- read.table("combined.txt", header=TRUE,sep="\t",check.names="FALSE")
clinical <- read.table("tcga-data.txt",header=TRUE,sep="\t",check.names="FALSE")

if (length(args) <= 1) {
  #stop("At least one argument must be supplied (input file).n", call.=FALSE)
  filelist = c("test/TCGA-A7-A0CE.json","test/TCGA-A7-A0CH.json","test/TCGA-A7-A0D9.json","test/TCGA-A7-A0DB.json")
} else if (length(args)>1) {
  filelist = args[2:length(args)]
  type = args[1]
}

datalist = lapply(filelist,function(x){
  test <- fromJSON(x)
  test[1,"sampleID"]
})

datalist <- unlist(datalist)
data <- all[,c("gene","process",datalist)]

#targetProcess <-"Translation"
#targetCancer <- "BRCA"
#targetPatient <- clinical$sampleID[clinical$Cancer_type==targetCancer]

#subsetdata <- subset(data,Function==targetProcess)
#rownames(subsetdata) <- subsetdata[,1]
#subsetdata <- subsetdata[,targetPatient]

setwd("../data/heatmap")
mitofunc <- unique(data[,"process"])
for(i in 1:length(mitofunc)){
  subsetdata <- subset(data,process==mitofunc[i])
  rownames(subsetdata) <- subsetdata[,1]
  subsetdata <- subsetdata[,3:ncol(subsetdata)]
  outputname <- paste(mitofunc[i],".html",sep="")
  
  p <- heatmaply(subsetdata,scale_fill_gradient_fun = ggplot2::scale_fill_gradient2(low = "blue", high = "red", midpoint = 0)) %>% layout(margin = list(l = 130, b = 100),xaxis=list(tickfont=list(size=7),tickangle=270),yaxis2=list(tickfont=list(size=5)))
  
  htmlwidgets::saveWidget(p, outputname,selfcontained = FALSE)

}

