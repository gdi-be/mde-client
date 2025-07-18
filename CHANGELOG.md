## [3.19.1](https://github.com/gdi-be/mde-client/compare/v3.19.0...v3.19.1) (2025-07-15)


### Bug Fixes

* remove unused searchForMetadata method ([efb9e65](https://github.com/gdi-be/mde-client/commit/efb9e65d952faf22896e182d6c80de69bc875791))
* update assignment button visibility ([0ab1711](https://github.com/gdi-be/mde-client/commit/0ab1711748e827384e8be3e6dd658548dc941f16))
* use query interface instead of search ([20bfba5](https://github.com/gdi-be/mde-client/commit/20bfba59ce9de113936ee886d917775a10a4d99f))

# [3.19.0](https://github.com/gdi-be/mde-client/compare/v3.18.1...v3.19.0) (2025-07-07)


### Bug Fixes

* improve default copy function ([1751591](https://github.com/gdi-be/mde-client/commit/1751591916f82e94886a0800ed252d61f797466c))
* remove copy button from all service field ([3992484](https://github.com/gdi-be/mde-client/commit/3992484148dc6f6aa5949bc4f2a707a437569db6))
* update copyValue function ([a27c6be](https://github.com/gdi-be/mde-client/commit/a27c6bee30bf44903d4a21059b4d69eedf585eb9))


### Features

* **25686:**  add copy function for keywords ([527399b](https://github.com/gdi-be/mde-client/commit/527399ba96ae4c896c6913075a692adb8e57d960))
* **25787:**  add copy function for annex theme ([2b0fc9e](https://github.com/gdi-be/mde-client/commit/2b0fc9eaec8e010aae78313a3f39dd496a9e3ad0))
* add copy button to all contacts subfields ([724757b](https://github.com/gdi-be/mde-client/commit/724757b6837672af6d5ee8fc899624830ab911ee))
* add getCopyValue for AdditionalInformation ([5d38b12](https://github.com/gdi-be/mde-client/commit/5d38b12e1e90a45bc2a9a522d4d5628ced4c4de0))
* add getCopyValue for date fields ([22bf741](https://github.com/gdi-be/mde-client/commit/22bf7414e45fe3eb03e36ca46175251531097b63))
* add getCopyValue for lineage ([fd14e35](https://github.com/gdi-be/mde-client/commit/fd14e355a18efe1624cf8fac7a1aa6cf08c21418))
* add getCopyValue for maintenance frequency ([0a9df6a](https://github.com/gdi-be/mde-client/commit/0a9df6ad1db89c896b5d6cd527a089623d1ca177))
* add getCopyValue for privacy and terms of use ([eb0bbe1](https://github.com/gdi-be/mde-client/commit/eb0bbe1337ddc2732fddd366aaf58c7e2f004d9e))
* add getCopyValue for quality report checked ([10fb170](https://github.com/gdi-be/mde-client/commit/10fb17061f744db88360cc63a4bedb1496eb4fa4))
* add getCopyValue for resolution ([29de297](https://github.com/gdi-be/mde-client/commit/29de297626d993c94928327308e5bf21a5081288))
* add getCopyValue for topic category ([6018ad6](https://github.com/gdi-be/mde-client/commit/6018ad654424b1bf8eeb8adfd27684ef975099cb))
* add getCopyValue function ([6431382](https://github.com/gdi-be/mde-client/commit/6431382b1f877713fa87b8b5e79faa6dc8f278d8))
* add getCopyValue to metadataProfile field ([4752b34](https://github.com/gdi-be/mde-client/commit/4752b349fefbffb8119ec8ac90012bdcb5576120))
* remove downloads section from form ([f4efd84](https://github.com/gdi-be/mde-client/commit/f4efd845fe6e108028ec98f3dd31f8697526c704))

## [3.18.1](https://github.com/gdi-be/mde-client/compare/v3.18.0...v3.18.1) (2025-07-07)


### Bug Fixes

* also allow selfassigning when resonsibleRole is null ([268057e](https://github.com/gdi-be/mde-client/commit/268057e45559fb3d81f2cbc86ef2937f184b8eda))

# [3.18.0](https://github.com/gdi-be/mde-client/compare/v3.17.0...v3.18.0) (2025-07-04)


### Bug Fixes

* open links in new tab for published catalog records ([50ce113](https://github.com/gdi-be/mde-client/commit/50ce11338e291aa31630b0e155c1387278a7a1e4))
* update parseToken with correct encoding ([aa732f1](https://github.com/gdi-be/mde-client/commit/aa732f1d954676c96dada6db4a13f45d8112de38))
* update text ([1220d14](https://github.com/gdi-be/mde-client/commit/1220d14e021bc64f585d71f6c207c9db834ea3c4))
* update token context handling ([9c69005](https://github.com/gdi-be/mde-client/commit/9c69005392e6c145c50b70968782c31968dce3d2))


### Features

* grant editor access to datasource field ([fa626d0](https://github.com/gdi-be/mde-client/commit/fa626d0eb33c2ca8880d21afa7b0007089fd610c))

# [3.17.0](https://github.com/gdi-be/mde-client/compare/v3.16.1...v3.17.0) (2025-07-03)


### Bug Fixes

* allow configuration of workspace for all services ([06d4c7f](https://github.com/gdi-be/mde-client/commit/06d4c7f4c15ff635560637c9b9ec8d4ff84be2b3))
* cleanup services when changing type ([452d039](https://github.com/gdi-be/mde-client/commit/452d039c4fb6024ed019a0db432f9856e5bd3157))
* delay print to ensure data is loaded ([ed489dc](https://github.com/gdi-be/mde-client/commit/ed489dccd968766dbbe82a07ef56b0efa8c811ad))
* improve CommentsPanel ([831b277](https://github.com/gdi-be/mde-client/commit/831b277381c60cc6b1d3f13af538eb04a624fa0e))
* improve token handling ([96dc4e8](https://github.com/gdi-be/mde-client/commit/96dc4e8126c3b6fcbd73ae0c8133dc9f23b28422))
* imprve redirecting on outdated tokens ([d3b28d5](https://github.com/gdi-be/mde-client/commit/d3b28d5465b11a789b6b4b951b3ac79e42fe99b9))
* remove duplicated arrow icon ([9afa735](https://github.com/gdi-be/mde-client/commit/9afa7354e848369cd9fbaef6b352fd440d5ebb83))
* update validation error color for optional fields ([95875ba](https://github.com/gdi-be/mde-client/commit/95875ba3f5c73d55f67799e5a6bd20c51381aaa1))


### Features

* make featureTypes and downloads required ([b007b19](https://github.com/gdi-be/mde-client/commit/b007b199754659474e7e4def2c99af56883c3904))

## [3.16.1](https://github.com/gdi-be/mde-client/compare/v3.16.0...v3.16.1) (2025-07-02)


### Bug Fixes

* no default value for lineage date ([15bd0cf](https://github.com/gdi-be/mde-client/commit/15bd0cfbf265419cb7ed64854c222f03ab492a09))
* prevent resizing of comments input ([c6441b5](https://github.com/gdi-be/mde-client/commit/c6441b56d87f6474bb4d902570dff009ae10f3e7))
* update validation of layers and its properties ([f9335fc](https://github.com/gdi-be/mde-client/commit/f9335fca0c1e272fb8453e42bc3487e2787cd816))

# [3.16.0](https://github.com/gdi-be/mde-client/compare/v3.15.0...v3.16.0) (2025-07-01)


### Features

*  add comments to readonly view ([e09678a](https://github.com/gdi-be/mde-client/commit/e09678a38916b846acd0b0e0efcdd4e78844bda8))
* add more read only snippets ([a563492](https://github.com/gdi-be/mde-client/commit/a563492018fdf5f63d36ad0d58883287c64c9e51))
* reduce spacing in read only view ([234c391](https://github.com/gdi-be/mde-client/commit/234c39116f04e023d3ede1715ea4d3e2275bd7da))
* update print layout ([c2fd8ce](https://github.com/gdi-be/mde-client/commit/c2fd8cee130e41946d5ecdea5db93556d2f39ca2))

# [3.15.0](https://github.com/gdi-be/mde-client/compare/v3.14.0...v3.15.0) (2025-06-30)


### Bug Fixes

* cleanup layers if needed ([26547ea](https://github.com/gdi-be/mde-client/commit/26547ea43f383430e7bc2cd394b8f3ada14850b7))
* hide disabled options ([959c512](https://github.com/gdi-be/mde-client/commit/959c512ae88ad31494d9230d48749a47d761fbce))
* improve progress handling ([70a815c](https://github.com/gdi-be/mde-client/commit/70a815c8ff82f12baeabf9928f9ba6043f55987f))
* update layout of comment delete icon ([eaf7602](https://github.com/gdi-be/mde-client/commit/eaf760233bfb035beee1ffd4df207d4b23e1e208))
* update phone number validation ([48e1a44](https://github.com/gdi-be/mde-client/commit/48e1a44cdbbfecb88706761ea43bda6fdafcd6ca))
* use label from config ([720719a](https://github.com/gdi-be/mde-client/commit/720719a5806c4009e0afa90127bf79190152cb6d))


### Features

* add autofill button for ServicePreview ([dcfecd2](https://github.com/gdi-be/mde-client/commit/dcfecd20be85efe5ed1ffeb5c531007a4df75654))
* add extra fieldset for INSPIRE fields ([71cb3f5](https://github.com/gdi-be/mde-client/commit/71cb3f53dbca473cf548f9c655ac10be51ccaec9))
* fix focus issues and add checkmarks to service fields ([7062adb](https://github.com/gdi-be/mde-client/commit/7062adb0335c62820ba92a2b8829af8e8e048ab4))

# [3.14.0](https://github.com/gdi-be/mde-client/compare/v3.13.1...v3.14.0) (2025-06-30)


### Bug Fixes

* update validation of KeyWords field ([58cdd00](https://github.com/gdi-be/mde-client/commit/58cdd00b4345c3537da39f855977073501f2c20f))
* update value handling of ResolutionField ([604d358](https://github.com/gdi-be/mde-client/commit/604d358b0593f237ff0f722ffcb3a46fe9ec537e))


### Features

* add debug logging to allFieldsValid method ([e1b6df7](https://github.com/gdi-be/mde-client/commit/e1b6df7dd91c53e723c54a8101ac627ad0a19caf))
* enhance validation logic and add service support in forms ([257b602](https://github.com/gdi-be/mde-client/commit/257b602923726e9b8c95ae47e650613e7bc0ffdb))

## [3.13.1](https://github.com/gdi-be/mde-client/compare/v3.13.0...v3.13.1) (2025-06-26)


### Bug Fixes

* filter null/undefined values ([b1d91ad](https://github.com/gdi-be/mde-client/commit/b1d91ad2695919d1251ee2d5719a8e1f19dd27ed))

# [3.13.0](https://github.com/gdi-be/mde-client/compare/v3.12.1...v3.13.0) (2025-06-26)


### Bug Fixes

* adapt assignment button visibility ([7bed5c4](https://github.com/gdi-be/mde-client/commit/7bed5c492b4e0add1815e99b8db0b514c535eefa))
* field config refactoring ([ef039a7](https://github.com/gdi-be/mde-client/commit/ef039a72661a36fcdc7f448644fc399dfe36510b))
* update keys in FieldsConfig ([41c5410](https://github.com/gdi-be/mde-client/commit/41c541039a875c043f8e8150893ea8e9caadc55a))
* update LayersForm validation ([f848f50](https://github.com/gdi-be/mde-client/commit/f848f50d38b021dc52562ab276a4a907b1c88637))


### Features

* add progress info to Progressbar ([d5897b9](https://github.com/gdi-be/mde-client/commit/d5897b90675df7e52eb756b14e5580811c5ef638))

## [3.12.1](https://github.com/gdi-be/mde-client/compare/v3.12.0...v3.12.1) (2025-06-18)


### Bug Fixes

* allow removal of published date ([b10e87e](https://github.com/gdi-be/mde-client/commit/b10e87ebea3ee9a9dbe6671d50a9574069687768))
* fix validation for dhs ([1d3069d](https://github.com/gdi-be/mde-client/commit/1d3069d409588c8d321db0f21fba93203316b969))
* limit title to 250 characters ([36bbc0d](https://github.com/gdi-be/mde-client/commit/36bbc0d7c1e14b373c6deadef1de9c050cf1b548))
* prevent default event behavior when adding items ([6899eab](https://github.com/gdi-be/mde-client/commit/6899eab3e760f560b1ff6903c1e2a04d43be44bb))

# [3.12.0](https://github.com/gdi-be/mde-client/compare/v3.11.1...v3.12.0) (2025-06-16)


### Bug Fixes

* exclude hidden fields from progress calculation ([5be4f1c](https://github.com/gdi-be/mde-client/commit/5be4f1c8c16630a4df5133b50c23356cc09fa25a))
* remove quotes from copied valued ([703cf26](https://github.com/gdi-be/mde-client/commit/703cf2671aa25a3c3ce620f3779b752e12426f18))
* typo ([1485adc](https://github.com/gdi-be/mde-client/commit/1485adc5e6740ce41ce78258c0e2baef0dd32450))
* typo ([44764b2](https://github.com/gdi-be/mde-client/commit/44764b2d3bff1821a093e13091cbe9bc6c6e2198))


### Features

* add popconfirm to copyFromOriginal button ([0d255a8](https://github.com/gdi-be/mde-client/commit/0d255a83561950561b0515f35642f6b95477f9df))
* fix progress update in LayersForm ([476f0f3](https://github.com/gdi-be/mde-client/commit/476f0f367027217ab6a36dc81b8d32e1209fa51e))

## [3.11.1](https://github.com/gdi-be/mde-client/compare/v3.11.0...v3.11.1) (2025-06-16)


### Bug Fixes

* add workaround for focus issue ([7da679a](https://github.com/gdi-be/mde-client/commit/7da679a131460a956b593c8353b0b60cce59e9dd))
* always reload data in persistValue method ([e5f7441](https://github.com/gdi-be/mde-client/commit/e5f74411aa975dce15f3aad01b4eece6b843a674))
* dataowner can't assign to user ([3b4d0a6](https://github.com/gdi-be/mde-client/commit/3b4d0a693e6664ce0e7204a043bd6c8fd718f3f5))
* generate ids with crypto ([7d9780c](https://github.com/gdi-be/mde-client/commit/7d9780c412970254dd210610c15606be0492f89f))
* remove "required" from inputs ([de7d231](https://github.com/gdi-be/mde-client/commit/de7d231c676b88f2c70dad211cb27cc2e14610d6))
* remove duplicated field hint ([565404e](https://github.com/gdi-be/mde-client/commit/565404e905a49cf81cb115d63348fec1d5f2725f))
* update service form ([7be6b5a](https://github.com/gdi-be/mde-client/commit/7be6b5a37f9b135dc07b09573b0f31c0c7231931))
* update tab rendering in service section ([6836c4c](https://github.com/gdi-be/mde-client/commit/6836c4cc1093c38d6076a261b03fc95a5e84ab0f))
* update validation of HVD input ([9730a83](https://github.com/gdi-be/mde-client/commit/9730a833026efe270d334efb377f1b45ff7b55cf))

# [3.11.0](https://github.com/gdi-be/mde-client/compare/v3.10.0...v3.11.0) (2025-06-16)


### Bug Fixes

* readd (improved) CSS hack for SelectInputs ([4e78f78](https://github.com/gdi-be/mde-client/commit/4e78f78615c31503a14c7783aed07d50a46d1364))


### Features

* add code input to AdditionalInformation ([dc83eb7](https://github.com/gdi-be/mde-client/commit/dc83eb7510aa8459e43a95f9870eb8c98a250d31))
* search for MetadataCollections in Lineage field ([5c4b1de](https://github.com/gdi-be/mde-client/commit/5c4b1de5d85f3dcbec3e399bde7c2698a6ca4ce9))

# [3.10.0](https://github.com/gdi-be/mde-client/compare/v3.9.0...v3.10.0) (2025-06-13)


### Bug Fixes

* add license ([9fe4526](https://github.com/gdi-be/mde-client/commit/9fe4526cb68fc26ee3fd9e7682b39c8004185ced))
* change button order ([6ab3ba0](https://github.com/gdi-be/mde-client/commit/6ab3ba0297bf7f9035257dd80067e10a28e305e4))
* hide download button for data owners ([49beb1d](https://github.com/gdi-be/mde-client/commit/49beb1d774f0007d032c3614546773ff22b0ace3))
* remove css important ([04d4e90](https://github.com/gdi-be/mde-client/commit/04d4e90c025e4c804d845a9e4f4a45fab090c103))
* rename login ([f0a17e7](https://github.com/gdi-be/mde-client/commit/f0a17e7df5b23649074f99987f63f23dc5383df3))
* update formState on changed data ([37f231a](https://github.com/gdi-be/mde-client/commit/37f231afb3ed1a885de195fa66cfc7bf51c96903))


### Features

* add error feedback via toasts ([ef76465](https://github.com/gdi-be/mde-client/commit/ef764655a0047a653fada424237eb68682120c0b))

# [3.9.0](https://github.com/gdi-be/mde-client/compare/v3.8.0...v3.9.0) (2025-06-12)


### Bug Fixes

* adapt comment quick link ([5204f7e](https://github.com/gdi-be/mde-client/commit/5204f7e69dcc1782f61ad4b2ffbc6a3c3f57d60c))
* add fallback if services is null ([c165766](https://github.com/gdi-be/mde-client/commit/c16576641caed0923382d88aeecd23bf8626565f))
* correct index in attribute form ([acde73f](https://github.com/gdi-be/mde-client/commit/acde73f1512895d23e896b1689928a4cde2becf0))
* move high value dataset flag ([e5be936](https://github.com/gdi-be/mde-client/commit/e5be93604f0c1833e229878908728a781d134531))
* remove obsolete field ([9fd9285](https://github.com/gdi-be/mde-client/commit/9fd928518e8b9488a16bc03f677382dca50c8b82))
* update field validation for service section ([a57b3f9](https://github.com/gdi-be/mde-client/commit/a57b3f9ac2a1b24b0d6e9e93fe0ab98530fe87c6))
* update redirect to readonly ([3d20a23](https://github.com/gdi-be/mde-client/commit/3d20a23e357a964b69b87b6abf1b94e0317a0846))
* update ResolutionField ([8363803](https://github.com/gdi-be/mde-client/commit/83638032098d71624a1d4eb967c7f14fe262fe65))
* update transformedValue in extent ([d4f6ab5](https://github.com/gdi-be/mde-client/commit/d4f6ab550bc2f874ab253ae23cfc2ea9b5b98242))


### Features

* add popconfirm to delete icons ([d75a79f](https://github.com/gdi-be/mde-client/commit/d75a79f7c10ea62f726da0bd53f7d034b1e9423e))
* add service.workspace (45) ([6845d29](https://github.com/gdi-be/mde-client/commit/6845d29b18debc873bc70aeddcd02bef75dc9165))

# [3.8.0](https://github.com/gdi-be/mde-client/compare/v3.7.0...v3.8.0) (2025-05-26)


### Bug Fixes

* adapt check of publish button ([8c6e03d](https://github.com/gdi-be/mde-client/commit/8c6e03d00bc9ae66f84d5e30267497661a1e79e6))


### Features

* make ServiceId field read only ([465e20d](https://github.com/gdi-be/mde-client/commit/465e20db02ad7b7b9225f481c44c311173602556))

# [3.7.0](https://github.com/gdi-be/mde-client/compare/v3.6.1...v3.7.0) (2025-05-22)


### Bug Fixes

* hide create button for QualityAssurance ([beaaf54](https://github.com/gdi-be/mde-client/commit/beaaf543a5cde37386bd1fbccb14e7fb35b3f0fc))
* show ScrollToTopButton per default ([7c4247a](https://github.com/gdi-be/mde-client/commit/7c4247a2e791bf9390c137772736ad156aa0a71a))


### Features

* add CSS for thumbnail in help ([a999bfa](https://github.com/gdi-be/mde-client/commit/a999bfa9da8efb9504c7793505cb92386be4484c))
* add layers to read only view ([d43e26c](https://github.com/gdi-be/mde-client/commit/d43e26ce3733758f3341d285f25611930ff706f9))

## [3.6.1](https://github.com/gdi-be/mde-client/compare/v3.6.0...v3.6.1) (2025-04-30)


### Bug Fixes

* fix loss of focus when tabbing ([aaae88e](https://github.com/gdi-be/mde-client/commit/aaae88e87502096dd80e27bcecc4535abba6e6b6))

# [3.6.0](https://github.com/gdi-be/mde-client/compare/v3.5.0...v3.6.0) (2025-04-29)


### Bug Fixes

* show internal error messages ([cd6b51d](https://github.com/gdi-be/mde-client/commit/cd6b51de252519711cfc5eae251d9a9a671e184e))
* show validation button always ([12fdbf6](https://github.com/gdi-be/mde-client/commit/12fdbf690a27e6f425b662b05abeefae3e2ba3cb))
* update handling of disabled state for TopicCategory ([68b42c3](https://github.com/gdi-be/mde-client/commit/68b42c38385788e9ae1ed781cc0e25d2521c226d))
* update parsing the error messages ([50443eb](https://github.com/gdi-be/mde-client/commit/50443eb0e889aae9a09f5c8aed524d382950c5d1))
* use emoji similar to GNOS icons ([7ece9d0](https://github.com/gdi-be/mde-client/commit/7ece9d0ba1486585f912e6319b4d87c9ff4b37cb))


### Features

* get value from original button ([9ee3f14](https://github.com/gdi-be/mde-client/commit/9ee3f144f9d81e5d38fb0bcf4133e98ff3486609))
* harmonize usage of the Dialog component ([724d8d2](https://github.com/gdi-be/mde-client/commit/724d8d20ea16cc609a8a377b6982ca795b55fdbc))
* init publish panel ([9827ff8](https://github.com/gdi-be/mde-client/commit/9827ff8c789c19c084e1a7b5902b0a8c7cfb6e20))
* show remaining session time ([e9357a8](https://github.com/gdi-be/mde-client/commit/e9357a8d3123318a8590d554ac587ceef499bb7f))

# [3.5.0](https://github.com/gdi-be/mde-client/compare/v3.4.0...v3.5.0) (2025-04-24)


### Bug Fixes

* only transform extent if defined ([8c18ad7](https://github.com/gdi-be/mde-client/commit/8c18ad71373d867abfd7a871c96ecbcc8b01dd80))


### Features

* add ability to search for existing lineages ([4e16ecc](https://github.com/gdi-be/mde-client/commit/4e16eccb3e2bf606151e9489c37339df5f2354f1))
* add missing fields termsOfUseSource and relatedTopics ([0385aaa](https://github.com/gdi-be/mde-client/commit/0385aaa2119ca2e5bf7b902c155ca8b01f1877ca))
* add placeholder deliveredCrs field ([64c333f](https://github.com/gdi-be/mde-client/commit/64c333f9b71b2eff1ea2cef19b9f7720b7889bde))
* adds a ribbon with the published date ([a55666a](https://github.com/gdi-be/mde-client/commit/a55666a8bcfa9ff06487095eccf684157da52ac2))
* allows multiple values for inspireTheme and topicCategory ([7936e05](https://github.com/gdi-be/mde-client/commit/7936e055be963c5ba8af3ed6a731b49975dc59c5))
* auto fill contact data ([c4c2064](https://github.com/gdi-be/mde-client/commit/c4c2064e84c1a7561ae0d84a9ac2f508a79e80aa))
* introduces MultiSelectInput ([bac41f9](https://github.com/gdi-be/mde-client/commit/bac41f9d927209bbb047cbf29ca40a0edd54fcd4))

# [3.4.0](https://github.com/gdi-be/mde-client/compare/v3.3.2...v3.4.0) (2025-04-17)


### Features

* add explanation configs for services ([56c676d](https://github.com/gdi-be/mde-client/commit/56c676db8d46da2a87c1b0ad07dced79aef76da8))
* introduces FieldHint component ([be1e7c7](https://github.com/gdi-be/mde-client/commit/be1e7c726d73bb0b17f1bff5ee9c0ad2bf670c11))

## [3.3.2](https://github.com/gdi-be/mde-client/compare/v3.3.1...v3.3.2) (2025-04-16)


### Bug Fixes

* remove proxy for server sent events ([5360a2d](https://github.com/gdi-be/mde-client/commit/5360a2dbe329c5bb7e14fa3df40bbbe54b474a27))

## [3.3.1](https://github.com/gdi-be/mde-client/compare/v3.3.0...v3.3.1) (2025-04-16)


### Bug Fixes

* remove vite proxy, include app internal route ([d5f7b0a](https://github.com/gdi-be/mde-client/commit/d5f7b0a5b36bee55a63471919cdf0cb0a22b7eac))

# [3.3.0](https://github.com/gdi-be/mde-client/compare/v3.2.0...v3.3.0) (2025-04-16)

### Bug Fixes

- fix link in MetadataCard ([3a996e6](https://github.com/gdi-be/mde-client/commit/3a996e6df3257a845279bbe850618e9c91b85cb3))
- fix rolename handling ([2625367](https://github.com/gdi-be/mde-client/commit/262536707d3643062a94770f21b4930cd7f16fe9))
- linting ([a8b728a](https://github.com/gdi-be/mde-client/commit/a8b728ae195394299a42c02e39419f0465941c43))
- linting ([a3bbd55](https://github.com/gdi-be/mde-client/commit/a3bbd5523fdf8d2281d2af9ad6d84e64f2dc974f))
- typo ([4868355](https://github.com/gdi-be/mde-client/commit/48683559ac1434590a120fb3668f0ffaa847916b))
- updates metadata context correctly ([41b8d87](https://github.com/gdi-be/mde-client/commit/41b8d87173a8e31765f8068ed137297693258aee))

### Features

- adds LayersForm ([0aed492](https://github.com/gdi-be/mde-client/commit/0aed4925b0b9520f094f3d97eeb64b1c8dc7b8cc))
- introduces FeatureTypes ([ed96a40](https://github.com/gdi-be/mde-client/commit/ed96a40816aa27a21b529f54035a289e42f64c0a))
- rename roles ([054ecc6](https://github.com/gdi-be/mde-client/commit/054ecc62a0b576543b4c99ba50623d6d57bba186))
- show validation results ([44f8d28](https://github.com/gdi-be/mde-client/commit/44f8d28f8584c25f087d86ffda236d76cc8e2d81))
- update legend size in the form ([551d4ec](https://github.com/gdi-be/mde-client/commit/551d4ecb331c35d8c24e9cf56427cb5abe003ac5))
- updates readonly view ([0e9ffed](https://github.com/gdi-be/mde-client/commit/0e9ffede529a016ecc2d64d074b5b49dec4a6aab))

# [3.2.0](https://github.com/gdi-be/mde-client/compare/v3.1.0...v3.2.0) (2025-04-10)

### Features

- actually delete the selected metadata collection ([9fddc40](https://github.com/gdi-be/mde-client/commit/9fddc401c8ade7f0d9e3f199802df4b9b6e7c0cb))

# [3.1.0](https://github.com/gdi-be/mde-client/compare/v3.0.1...v3.1.0) (2025-04-10)

### Bug Fixes

- update Annex Version Field ([de504c1](https://github.com/gdi-be/mde-client/commit/de504c18633562c11fafa8d3ce594e7190bf3134))
- use fieldConfig for DisplayField ([2e0ddbd](https://github.com/gdi-be/mde-client/commit/2e0ddbdddb8365260c58c69dfff188441f80cbc4))

### Features

- add download button ([ad750b8](https://github.com/gdi-be/mde-client/commit/ad750b828ac6c39ca570addb379de88f4646c0ff))
- improve filename of download ([885ea75](https://github.com/gdi-be/mde-client/commit/885ea7596edcbc7bd8ddb85b5e579560a268f1bc))
- replaces valid with approved ([484153d](https://github.com/gdi-be/mde-client/commit/484153d775916588e2b4fcae6a581ad5fff42eff))

## [3.0.1](https://github.com/gdi-be/mde-client/compare/v3.0.0...v3.0.1) (2025-04-09)

### Bug Fixes

- send json repsonse in replace_variable interface ([fe0eccf](https://github.com/gdi-be/mde-client/commit/fe0eccfe7d2dbd9a6bba5ae5bc82c1e1a11aef48))

# [3.0.0](https://github.com/gdi-be/mde-client/compare/v2.0.1...v3.0.0) (2025-04-09)

### Bug Fixes

- fix build ([60abaa8](https://github.com/gdi-be/mde-client/commit/60abaa815dba145234186a645792b07204ebbe76))

### Features

- replace image source with variables ([ab6852f](https://github.com/gdi-be/mde-client/commit/ab6852f3c26a2d651505b7eedf2eea4beaaee078))

### BREAKING CHANGES

- requires mounted variables file at /data/variables.json

## [2.0.1](https://github.com/gdi-be/mde-client/compare/v2.0.0...v2.0.1) (2025-04-09)

### Bug Fixes

- comments from readonly ([f39a994](https://github.com/gdi-be/mde-client/commit/f39a994fe3f7d846dc2e1b621b58d4dbbc050995))
- make value bindable in ServiceShortDescription ([315958b](https://github.com/gdi-be/mde-client/commit/315958bd73b01915620ee297eb3120a77a3ca909))
- update actions in MetadataCard ([8f8de34](https://github.com/gdi-be/mde-client/commit/8f8de345ee9ef70358310ca83b80320d6dd6eb7a))
- update binding of TextAreaInput ([2b902a5](https://github.com/gdi-be/mde-client/commit/2b902a50a51d0dafaf420c083bb7c14140bea98d))
- update data initialization in readonly ([9d8e61b](https://github.com/gdi-be/mde-client/commit/9d8e61b33efdc4c2a4141c80ee238c8ddf7b9cf6))

# [2.0.0](https://github.com/gdi-be/mde-client/compare/v1.3.0...v2.0.0) (2025-04-09)

### Features

- load labels, explanation and hint from codelist ([b698c87](https://github.com/gdi-be/mde-client/commit/b698c875f0aaac9ffcc3cbfdf405a009ce042348))
- update layout of all fields ([8a6f9b7](https://github.com/gdi-be/mde-client/commit/8a6f9b79e76782c513c08550dfb17c5fd38e6aa5))
- update tab layout ([eca2a5a](https://github.com/gdi-be/mde-client/commit/eca2a5ad1278e84237ed77288df05adb060d3baf))

### BREAKING CHANGES

- requires a mounted field_labels.yaml file in your codelists folder

# [1.3.0](https://github.com/gdi-be/mde-client/compare/v1.2.0...v1.3.0) (2025-04-07)

### Bug Fixes

- allow assignment only to own role ([ed462ca](https://github.com/gdi-be/mde-client/commit/ed462ca2ade1c86d672c610ea55524f2a2588cb9))
- fix bugs with keywords ([f882c62](https://github.com/gdi-be/mde-client/commit/f882c62c937b88eaf1a54312675dd504456615ba))
- prevent errors when fetching help ([b847e4d](https://github.com/gdi-be/mde-client/commit/b847e4dd94e182988228d19bde6aee1a99e5d367))
- remove console.log commands ([55718bc](https://github.com/gdi-be/mde-client/commit/55718bc4dc9d1b2c1697ed47eb4723379efb9dcd))
- remove unused getAll method ([e108935](https://github.com/gdi-be/mde-client/commit/e1089352c6cb5d8f3ae20a2c086b3e54a3b35ba6))
- replace less with scss in AssignmentDialog ([1ef399a](https://github.com/gdi-be/mde-client/commit/1ef399a156d2083f92aee1235f4787af8f94ec2e))
- set default page size to 20 ([4f6713e](https://github.com/gdi-be/mde-client/commit/4f6713edf5a6b87c397c2cd2d962b57a4850716d))
- update hvd label ([1c7711d](https://github.com/gdi-be/mde-client/commit/1c7711d311554e626ff72fa0c9a6e97dbe674f6b))
- update inspire theme validation ([3f40dcf](https://github.com/gdi-be/mde-client/commit/3f40dcf56fdd3f1b592956274c053d10d8e11dc4))

### Features

- add AssignmentDialog and team interface ([df7deeb](https://github.com/gdi-be/mde-client/commit/df7deeb1843e21b91bc607cb96df0e600c415b46))
- add more role specific handling ([1bc5088](https://github.com/gdi-be/mde-client/commit/1bc5088538d4d91e28f3e81571d172a5af899dbb))

# [1.2.0](https://github.com/gdi-be/mde-client/compare/v1.1.10...v1.2.0) (2025-04-01)

### Features

- improvements to FieldTools ([d20bfc2](https://github.com/gdi-be/mde-client/commit/d20bfc216d60afbe30531c7673d43def1302a453))

## [1.1.10](https://github.com/gdi-be/mde-client/compare/v1.1.9...v1.1.10) (2025-04-01)

### Bug Fixes

- adjust required fields in form ([6edfc80](https://github.com/gdi-be/mde-client/commit/6edfc80ecedfc6c47ae14e6cbeadf07a232ca591))
- fix release workflow ([c06ccc0](https://github.com/gdi-be/mde-client/commit/c06ccc000735260424eea2b8e8290cebcc2dfee9))

## [1.1.9](https://github.com/gdi-be/mde-client/compare/v1.1.8...v1.1.9) (2025-04-01)

### Bug Fixes

- fix release workflow ([4d79abd](https://github.com/gdi-be/mde-client/commit/4d79abdf5f4986040a60c646e4187cafc6d79d8c))

## [1.1.8](https://github.com/gdi-be/mde-client/compare/v1.1.7...v1.1.8) (2025-04-01)

### Bug Fixes

- fix release workflow ([75353cf](https://github.com/gdi-be/mde-client/commit/75353cf67a3f3540d35ff8611a0923e1648cbb6c))

## [1.1.7](https://github.com/gdi-be/mde-client/compare/v1.1.6...v1.1.7) (2025-04-01)

### Bug Fixes

- fix release workflow ([b42f5fd](https://github.com/gdi-be/mde-client/commit/b42f5fdf660241426bbea88ffff2670b742ccd53))

## [1.1.6](https://github.com/gdi-be/mde-client/compare/v1.1.5...v1.1.6) (2025-03-28)

### Bug Fixes

- fix release workflow ([8cd9e7b](https://github.com/gdi-be/mde-client/commit/8cd9e7b3fbf44e92d40a34e897c6de649070290e))

## [1.1.5](https://github.com/gdi-be/mde-client/compare/v1.1.4...v1.1.5) (2025-03-28)

### Bug Fixes

- fix release workflow ([7012de8](https://github.com/gdi-be/mde-client/commit/7012de8df58a667085d76c1fb35a51f0b2ebbd1c))

## [1.1.4](https://github.com/gdi-be/mde-client/compare/v1.1.3...v1.1.4) (2025-03-28)

### Bug Fixes

- fix release workflow ([dc4a8b8](https://github.com/gdi-be/mde-client/commit/dc4a8b8a56152ee7a69145e19a722f001d3b4e48))

## [1.1.3](https://github.com/gdi-be/mde-client/compare/v1.1.2...v1.1.3) (2025-03-28)

### Bug Fixes

- fix release workflow ([2561b96](https://github.com/gdi-be/mde-client/commit/2561b96fefa204f80b83c1165158b9284a72c806))

## [1.1.2](https://github.com/gdi-be/mde-client/compare/v1.1.1...v1.1.2) (2025-03-28)

### Bug Fixes

- fix release workflow ([a5eca17](https://github.com/gdi-be/mde-client/commit/a5eca17119b527f46f791eaf19fc92ec12bb5b37))

## [1.1.1](https://github.com/gdi-be/mde-client/compare/v1.1.0...v1.1.1) (2025-03-28)

### Bug Fixes

- fix release workflow ([a6cc83b](https://github.com/gdi-be/mde-client/commit/a6cc83bae164055a69da684e03f517a6bb5c1af4))

# [1.1.0](https://github.com/gdi-be/mde-client/compare/v1.0.0...v1.1.0) (2025-03-28)

### Bug Fixes

- fix release workflow ([efc8c6c](https://github.com/gdi-be/mde-client/commit/efc8c6c218a56ecf85ad7177f146fa1b7d551cfe))

### Features

- use mounted codelist for crs ([29683b9](https://github.com/gdi-be/mde-client/commit/29683b915d6a0abe60ad9695e95c57159fe3ba27))
- use mounted codelist for extents ([44813f7](https://github.com/gdi-be/mde-client/commit/44813f75b646807bff154df023f49b32df05ec01))
- use mounted codelist for HVD categories ([f9715ca](https://github.com/gdi-be/mde-client/commit/f9715ca8009724705f0ea910f53137c51c1c84f0))
- use mounted codelist for inspire themes ([353c177](https://github.com/gdi-be/mde-client/commit/353c17723260abcb4107f97098cd9cb269776162))
- use mounted codelist for privacy ([0f7e5c7](https://github.com/gdi-be/mde-client/commit/0f7e5c7611988944635465d23601bdc306d6f82b))

# 1.0.0 (2025-03-27)

### Bug Fixes

- add general validation for contacts ([a5e735d](https://github.com/gdi-be/mde-client/commit/a5e735d59304184018694cff46acc26acacba7c5))
- add minwidth for create card ([fca1cac](https://github.com/gdi-be/mde-client/commit/fca1cac7e1496ad209fd815304b2bd6919cb9248))
- add reload mechanism ([444173f](https://github.com/gdi-be/mde-client/commit/444173f12585bb7226a31f72578f451190503c7e))
- add scrollbar to help container ([9c71e46](https://github.com/gdi-be/mde-client/commit/9c71e46756904faa0a9e589d3c6c66b2bfe010a8))
- add value prop to inputs ([f229010](https://github.com/gdi-be/mde-client/commit/f2290100fca424afc4ce4ca51c04a53a3a5c9702))
- always show search menu ([2d58cc9](https://github.com/gdi-be/mde-client/commit/2d58cc95e3de42b35fdc9ff351307b6de1851db0))
- change contacts label ([ac5e895](https://github.com/gdi-be/mde-client/commit/ac5e89577c5fb4f4ef7ad9fd72e33db6c5829677))
- change route "editor" to "metadata" ([8360591](https://github.com/gdi-be/mde-client/commit/8360591bd4da44b786019f5f05aac39b6613a6ac))
- decrease fieldset legend font-size ([74ed7a2](https://github.com/gdi-be/mde-client/commit/74ed7a2429d4ba9f3305ab6f73cf9e5df508a9d3))
- disable LastUpdateField if automated ([89d37d9](https://github.com/gdi-be/mde-client/commit/89d37d97f6e6957d5ede405aa739fee3608b58fb))
- filter unsupported inspire theme ([b8094eb](https://github.com/gdi-be/mde-client/commit/b8094eba25cb9c7b4d8e2bb914e2dd38bfba9419))
- fix build ([3f07885](https://github.com/gdi-be/mde-client/commit/3f078854b9d287f1d516337328610ec98802dcfa))
- fix dockerfile ([305fd0d](https://github.com/gdi-be/mde-client/commit/305fd0df54b0f3e2f56a8811fe06ecf6a6a30978))
- fix dockerfile ([fca25ef](https://github.com/gdi-be/mde-client/commit/fca25effb116cf726c354c1a96654654e4261bd5))
- fix release workflow ([9ae270b](https://github.com/gdi-be/mde-client/commit/9ae270b716767676452ed0551598a1aeaf43599d))
- fix release workflow ([3be5a04](https://github.com/gdi-be/mde-client/commit/3be5a04a4ebcc1e2ef7c984b25c258d39eec38e6))
- fix release workflow ([356e1b4](https://github.com/gdi-be/mde-client/commit/356e1b45cdbc43dfb04b20d97b4487e590693034))
- fix release workflow ([32c3dd5](https://github.com/gdi-be/mde-client/commit/32c3dd5a0f11e95d8a45a79899c8e145c9b30d9e))
- fix release workflow ([4c7c7be](https://github.com/gdi-be/mde-client/commit/4c7c7be9cee9910a63498403c3fcf271b999c4b4))
- fix release workflow ([2878ad4](https://github.com/gdi-be/mde-client/commit/2878ad4df02d4dd97fa1a07499e256fe2703cbb3))
- fix release workflow ([502feab](https://github.com/gdi-be/mde-client/commit/502feabf3e39fd7cf95ba013e6039280556a218b))
- fix release workflow ([919b80c](https://github.com/gdi-be/mde-client/commit/919b80c11da3f44ad0522fc09e7edeac3ce0b7be))
- fix release workflow ([08ba049](https://github.com/gdi-be/mde-client/commit/08ba04959f28996cd3eda8872c71d01d75e87433))
- fix release workflow ([9c459f2](https://github.com/gdi-be/mde-client/commit/9c459f27ee1d664659608a365037b590f71a1cf7))
- get title form isometadata ([7256993](https://github.com/gdi-be/mde-client/commit/72569937edec57e11aec919e7a31caf2a417dc6f))
- improve some value checks ([34c80b7](https://github.com/gdi-be/mde-client/commit/34c80b7d915e2c6596828f9e543450de1cb727fa))
- improve TagsInput styling ([789f415](https://github.com/gdi-be/mde-client/commit/789f415e232413befd2270b17c68136b28f33901))
- improves/refactors ServiceSection ([3c33e9d](https://github.com/gdi-be/mde-client/commit/3c33e9dd34e138ff52ac4bbb7cc40351002bd88c))
- layout improvements ([07833df](https://github.com/gdi-be/mde-client/commit/07833dfc4e74c8c2357b38b861c6377a2ca1c690))
- linting ([99e70cf](https://github.com/gdi-be/mde-client/commit/99e70cf74f1873cb8d272031e2c94b555d761760))
- make children for FieldTools optional ([65dfe0d](https://github.com/gdi-be/mde-client/commit/65dfe0dd896dcca747b227719d26f7e50d8298c1))
- minor layout fixes ([9ffd5c1](https://github.com/gdi-be/mde-client/commit/9ffd5c144ef497e4bf3a515d311469a3e37fb2ff))
- only show AnnexThemeField for INSPIRE data ([1556f64](https://github.com/gdi-be/mde-client/commit/1556f643780fb511b1377c02a2deaa7f85697e94))
- pass metadata to components ([341127e](https://github.com/gdi-be/mde-client/commit/341127e914b32e46bb05c97260b1c2b60d2d476b))
- prevent unitended scrolling and remove animations ([751c771](https://github.com/gdi-be/mde-client/commit/751c771981e6ffeec7bb3a69cb0f8aff76f1fa42))
- readd help and fix checkmark icon ([610ab41](https://github.com/gdi-be/mde-client/commit/610ab41d32ff58330776259b40cf9cd805d867db))
- redirect to login if acces token invalid ([04883e0](https://github.com/gdi-be/mde-client/commit/04883e0303250cacccd873fc0404358877fea8d6))
- reduce animation ([aaec186](https://github.com/gdi-be/mde-client/commit/aaec1865094060a70fc8c9613352353ced435557))
- reduce more animations ([48e40b2](https://github.com/gdi-be/mde-client/commit/48e40b24f1a4b0f1a8ab94233ff33996b4f608a6))
- remove asteriks for required fields ([190c5f4](https://github.com/gdi-be/mde-client/commit/190c5f488ca29c5f843998b9564d5e7c0d587e7a))
- remove dark theme ([bcfa1cf](https://github.com/gdi-be/mde-client/commit/bcfa1cf1c1d9d00db7ff25a1f29ba782e54b62af))
- remove inlang i18n ([ee8faeb](https://github.com/gdi-be/mde-client/commit/ee8faeb27fe38ee676885cc2fec11173aae353f1))
- remove link for dark theme from app.html ([41b8dda](https://github.com/gdi-be/mde-client/commit/41b8ddaa9edff5bbb7ed4a13deb1d1ec59f74346))
- remove maxLength ([478c2b3](https://github.com/gdi-be/mde-client/commit/478c2b39a79358404d0a6c3b241a49cbc488a2f7))
- remove specialhandling for title ([ec193c9](https://github.com/gdi-be/mde-client/commit/ec193c94a39571fa4e78688194c17a4f27440fbb))
- remove toggle prop for regular actions ([8fa03cb](https://github.com/gdi-be/mde-client/commit/8fa03cb4ab345c3ccff29cdc3501a40c4a3bbbb7))
- remove uneeded copy of statics folder ([a9964e8](https://github.com/gdi-be/mde-client/commit/a9964e84e586424352cb52960218d70f5e93a231))
- remove unused code ([1b5efd9](https://github.com/gdi-be/mde-client/commit/1b5efd966b6f4cd1704c2bdd48f648045878f332))
- replace lang="less" with lang="scss" ([db09875](https://github.com/gdi-be/mde-client/commit/db09875b2a85eab74719009f1dd4d3191fcddf89))
- replace less with scss ([9717da9](https://github.com/gdi-be/mde-client/commit/9717da981889a99c97ab39f28cfacd8c41eec4c4))
- replace page store with page state ([32b3df8](https://github.com/gdi-be/mde-client/commit/32b3df8afb22b858ca8f8d23f2bbc6d6881015e3))
- replace Scrollable with flexwrap ([95d6b47](https://github.com/gdi-be/mde-client/commit/95d6b4742fb86c5d011aea7bdefb4eee0ea1399f))
- restore old search interface ([2b5c7f7](https://github.com/gdi-be/mde-client/commit/2b5c7f73c6decf3115eaedaa83768f0f53aeca55))
- save title on basemetadata also ([7437a2a](https://github.com/gdi-be/mde-client/commit/7437a2a78d9d4b6e634ad99f29f39c0a32c22168))
- set default section ([5b6d83c](https://github.com/gdi-be/mde-client/commit/5b6d83c32b013ce8f00299a786837fb145076f46))
- several bugfixes ([da953af](https://github.com/gdi-be/mde-client/commit/da953afa4955da8cfa58851e30b63b5a567dc0f8))
- show contact input if contacts is empty ([78257f0](https://github.com/gdi-be/mde-client/commit/78257f078474cb524f5aafc4de8e4b7ed7837760))
- simplify AutoFillButton ([8eef0c6](https://github.com/gdi-be/mde-client/commit/8eef0c6a63d1a58ded435e1cd36f67e02a8b9665))
- simplify preview field ([2ec482d](https://github.com/gdi-be/mde-client/commit/2ec482d30a3e50c3dddf220310f53439b59cc8ca))
- update AnnexTheme key ([bab1bf8](https://github.com/gdi-be/mde-client/commit/bab1bf816ca05a7623762fb2d5a4acc48f87c62b))
- update creation text ([dd52d0a](https://github.com/gdi-be/mde-client/commit/dd52d0aff57717cddc8f7ee5523260ee53e6b3e8))
- update default Header text ([02bfaf5](https://github.com/gdi-be/mde-client/commit/02bfaf5757c26992e9965d9cb743f0e6b2d61a87))
- update default value of ExtentField ([a126e23](https://github.com/gdi-be/mde-client/commit/a126e23f4bcf2af695b3146b4b56db743e9b5403))
- update format for DateTimeField ([6db414f](https://github.com/gdi-be/mde-client/commit/6db414fbfd91af9c5ef9f5995ecd5f72e3120960))
- update FormContext ([4101cb0](https://github.com/gdi-be/mde-client/commit/4101cb02b9c1ffb041aa81379ba77b4e68459402))
- update getProgess function and typing ([a709fed](https://github.com/gdi-be/mde-client/commit/a709fed7fa46d2774ac8a89707cba313eee547fb))
- update imports ([28e31dc](https://github.com/gdi-be/mde-client/commit/28e31dc44242e88a4403108027382ead77f9e73b))
- update input associations ([247d99c](https://github.com/gdi-be/mde-client/commit/247d99c689091ec82ab4240ef14df2d6e1b6ab0e))
- update label of title field ([1125f07](https://github.com/gdi-be/mde-client/commit/1125f0745f37628ddcc95662413752a45c7e288e))
- update MetadataSearchField ([0722984](https://github.com/gdi-be/mde-client/commit/0722984178fed2c2064506595c4dbb9a421567bd))
- update MetadataSearchField ([4340f69](https://github.com/gdi-be/mde-client/commit/4340f6962a13f26b250cf62c84fdb7f06cf9f1e2))
- update order of DataProtection options ([1671e33](https://github.com/gdi-be/mde-client/commit/1671e333a6ad214fc3ff133992da2476cea4eb9d))
- update Pagination ([a1e6646](https://github.com/gdi-be/mde-client/commit/a1e664680d99f2b47efb02f9538e01e45b035a48))
- update persistence of services and add legend field ([ffe3b7a](https://github.com/gdi-be/mde-client/commit/ffe3b7afb140c32ce19f5c012367894b05f17478))
- update PreviewField layout ([fad4960](https://github.com/gdi-be/mde-client/commit/fad49602d9c52661474392fbc69eea66773df84b))
- update print button ([1a5fa35](https://github.com/gdi-be/mde-client/commit/1a5fa353976854d9b7146a98d31ffcbeca028847))
- update QualityReportCheckField ([60a309d](https://github.com/gdi-be/mde-client/commit/60a309d58ec7710112022e0344d51c32788da7f3))
- update read only view for services ([91cc5b2](https://github.com/gdi-be/mde-client/commit/91cc5b20257f82b5a3f5b2649044d79dada99af3))
- update SelectInput layout ([b185002](https://github.com/gdi-be/mde-client/commit/b1850023e16088fade52c9ef0cd2d586574bed0e))
- update smui ([d16c74e](https://github.com/gdi-be/mde-client/commit/d16c74edde47e0b90ce00082f3822719c92ae9d0))
- update TermsOfUseField ([fcb728a](https://github.com/gdi-be/mde-client/commit/fcb728a753cb0a42645b1ba3bd73bc8aceff2bc9))
- update TopciCategory field ([643ec14](https://github.com/gdi-be/mde-client/commit/643ec1474923dab90082a0e39a525fbe76143ddb))
- update TopicCategory field ([dd1ff89](https://github.com/gdi-be/mde-client/commit/dd1ff89b49dad5999fd06c9676d84da532c0dd92))
- update welcome text ([5813bdd](https://github.com/gdi-be/mde-client/commit/5813bddd61540a81f4641b035f6152e8ba741066))
- use pointsOfContact for "Kontaktangaben" ([cfc252e](https://github.com/gdi-be/mde-client/commit/cfc252e7d009ea58001613ae35368684716faeca))
- use question mark for help icon ([c32d425](https://github.com/gdi-be/mde-client/commit/c32d425907d986a2917bcf7c7f2a93e65cf37ff4))
- use self hosted fonts ([d8a7105](https://github.com/gdi-be/mde-client/commit/d8a71050b1614d9a7b42026d02fbf5fc49bf7104))

### Features

- add action icons to MetadataCard ([4c9ff80](https://github.com/gdi-be/mde-client/commit/4c9ff801a5854530b9aea2d48aade328a6ec43f3))
- add Attribute and Downlad fields to ServiceForm ([43c3cca](https://github.com/gdi-be/mde-client/commit/43c3cca816715bf1a89811574f07c63c830c55ba))
- add autokeywords ([650654f](https://github.com/gdi-be/mde-client/commit/650654fab44fc5f92ff99bf3f1b23020ca0b9594))
- add Breadcrumbs ([a0445e4](https://github.com/gdi-be/mde-client/commit/a0445e4f3dc0804c9d987876708cd54429ff9f26))
- add ci build ([b17a15b](https://github.com/gdi-be/mde-client/commit/b17a15bed61bb79a3224568aeca6dc72a1474eb0))
- add client side authorization via keycloak-js ([38dcb51](https://github.com/gdi-be/mde-client/commit/38dcb51c4fbc7f3d8605304e0c59261c55479b8f))
- add contacts transition animation ([9ef89a9](https://github.com/gdi-be/mde-client/commit/9ef89a9fdd18193a2de42e0554a6f45d4f75703a))
- add CRS field validation ([5252f8f](https://github.com/gdi-be/mde-client/commit/5252f8f10021917bdcb893519fde42d123193ac3))
- add DateField validations ([e014bcf](https://github.com/gdi-be/mde-client/commit/e014bcfbbc87bc12f4f1bbda060bedacdd1cca0b))
- add dateime and published fields ([587bd3a](https://github.com/gdi-be/mde-client/commit/587bd3af4f5c7c6d9727034be8cd8242a8c35de5))
- add Dockerfile ([81ca461](https://github.com/gdi-be/mde-client/commit/81ca461a906417cbdc8fe1c2b1329a6e364be985))
- add enhancements to extent field ([bdc0775](https://github.com/gdi-be/mde-client/commit/bdc0775b162302084df12b759acc0228d5406d99))
- add Extent validation ([6d5caef](https://github.com/gdi-be/mde-client/commit/6d5caef750fdee84a6a31ce36f81354e8da06c62))
- add form navigation buttons ([9e03086](https://github.com/gdi-be/mde-client/commit/9e03086193e426795b6d1329d845f6bb2674020f))
- add form structure items ([e1579a4](https://github.com/gdi-be/mde-client/commit/e1579a4e8239bace2cb42ec0d1dfa786026937cd))
- add form transition animation ([b7cbcab](https://github.com/gdi-be/mde-client/commit/b7cbcab11e4b7c0df7a437e9e2b177a40d93b6bf))
- add FormContext for addtional fields ([f5b2177](https://github.com/gdi-be/mde-client/commit/f5b2177c51e808632871b7b15aca12dda56b6409))
- add InspireAnnexVersionField (38) ([d11d3b0](https://github.com/gdi-be/mde-client/commit/d11d3b09797fdb27813da0d23d30993b1020ea77))
- add logging lib ([b26fd4d](https://github.com/gdi-be/mde-client/commit/b26fd4df896900707e52d4c4494b9e1744679d85))
- add mask for comment panel ([8ff2d52](https://github.com/gdi-be/mde-client/commit/8ff2d528bfe5e91a2ce82167fe733726579bd364))
- add metadata api handling ([79d0e51](https://github.com/gdi-be/mde-client/commit/79d0e51ff2a5f7869f3a5f5a5d5cfbd519fa32ac))
- add MetadataType field ([79fdec5](https://github.com/gdi-be/mde-client/commit/79fdec5210239e4321cf17fd9f661f659b369ac3))
- add pagination ([56bc06f](https://github.com/gdi-be/mde-client/commit/56bc06f29731af12a6dd10973b6ddcc52003da96))
- add privacy field ([f641fb3](https://github.com/gdi-be/mde-client/commit/f641fb3b439c094228fc7b71a91ec9f48ce30fc5))
- add proper sorting by using query endpoint ([7902e90](https://github.com/gdi-be/mde-client/commit/7902e90526749e5540830d1a813d85cc5b9e4de7))
- add read only components ([9313c73](https://github.com/gdi-be/mde-client/commit/9313c734b61f15e5ee22453750fa84d78afa8348))
- add readonly route with print button ([851ffc1](https://github.com/gdi-be/mde-client/commit/851ffc1143e96a5db2570d689cfcce1835c28bb0))
- add release workflow ([91bdfbe](https://github.com/gdi-be/mde-client/commit/91bdfbe6a467acb451e9299ce87f1c06f906f91e))
- add Resolution validation ([f7f86cf](https://github.com/gdi-be/mde-client/commit/f7f86cf9eae469b322d5f4da977a232019c00cb4))
- add responsibility assignment ([10c29f2](https://github.com/gdi-be/mde-client/commit/10c29f232c4d962d86d5932612597db8ddb4ecd8))
- add support for cloning ([7fadcd6](https://github.com/gdi-be/mde-client/commit/7fadcd6523c0a20cf369181f4eaa0b7dcbbe4c45))
- add svelte:head to set page title ([e5f127f](https://github.com/gdi-be/mde-client/commit/e5f127f0676884a68ab6fc28449f7ed91d1b3adb))
- add UserMenu component ([5a7d935](https://github.com/gdi-be/mde-client/commit/5a7d93543e327c3459d11f925313d87d39cc45ea))
- add validation for DescriptionField ([626038b](https://github.com/gdi-be/mde-client/commit/626038b9c928524887ead57a35e9aa277f6b6b6e))
- add validation for KeywordsField ([64cbb33](https://github.com/gdi-be/mde-client/commit/64cbb33b05bdbb523552063774486893235de3b6))
- add validation for MetadataProfile ([fee4bde](https://github.com/gdi-be/mde-client/commit/fee4bde470e52cb1ffe73c45a2d0ea61e8126e95))
- add validation for TermsOfUse ([3169c77](https://github.com/gdi-be/mde-client/commit/3169c776224bc8e2b3d2ddc381248c180196b33f))
- add visibilityCondition to form config ([0476eee](https://github.com/gdi-be/mde-client/commit/0476eee235f3a265d4e7e38fb281c92d9b07ba6d))
- adjust client code to new backend services ([019a568](https://github.com/gdi-be/mde-client/commit/019a56897ffae229eb8dec2c1a25d3f131b0b7da))
- always autofill category ([36b09ab](https://github.com/gdi-be/mde-client/commit/36b09abc3ceec9c91299c8d72e9fb62a653fd56d))
- animate border for active tab ([327ed58](https://github.com/gdi-be/mde-client/commit/327ed58941d482201d639adfcd2d843c9d46100a))
- basic implementation of first section ([5660437](https://github.com/gdi-be/mde-client/commit/56604373ed3b4b8fc14798719e586cb7cfe08af7))
- combine resolution and scale fields ([220e59e](https://github.com/gdi-be/mde-client/commit/220e59edef199b78dc3f8d73425d50594f0e93cf))
- create form based on config ([4df494b](https://github.com/gdi-be/mde-client/commit/4df494b5ef768fc173b31baddf8ea07db9308b38))
- get formvalue from metadata ([9397a6e](https://github.com/gdi-be/mde-client/commit/9397a6e7e3eb2d796a9754dd0b9f67d2048d8f3b))
- initial commit ([e0a5f0f](https://github.com/gdi-be/mde-client/commit/e0a5f0f6fb0f929e1fefe321cbe5b772399ccb35))
- introduce action searchParam for readonly route ([da669a5](https://github.com/gdi-be/mde-client/commit/da669a52933d31da2ef28ade8942dc9eb574b8df))
- introduce ExtentField ([a9c16d9](https://github.com/gdi-be/mde-client/commit/a9c16d9bc4789ae1804e5410e4551aa353e6fe97))
- introduce LastUpdatedField ([86f2f93](https://github.com/gdi-be/mde-client/commit/86f2f934b1d3e48a7a08efe7e5fef236aa17c4c4))
- introduce MaintenanceFrequencyField ([ca507df](https://github.com/gdi-be/mde-client/commit/ca507df88fa2d76650692d2d0f63cfa958019833))
- introduce TopciCategory field ([2869058](https://github.com/gdi-be/mde-client/commit/28690580d3fa92afa472263b53a049f553abcbba))
- introduce update interface ([c839b48](https://github.com/gdi-be/mde-client/commit/c839b48cbea74ea0ed95ebb1e7265c672db39110))
- introduces AutoFillButton ([8fb3f52](https://github.com/gdi-be/mde-client/commit/8fb3f52fb525ec15d5f11c8270fd609628712878))
- introduces CopyButton ([e6a8fac](https://github.com/gdi-be/mde-client/commit/e6a8faca6be421b3d85b870de82ffecbe7b451d0))
- introduces create interface ([43ff298](https://github.com/gdi-be/mde-client/commit/43ff298d93c16126c57f62ed7acdc3b1caf6cc68))
- introduces MetadataSearchField ([dcd2abd](https://github.com/gdi-be/mde-client/commit/dcd2abd020d0a57e77c8b239be3f24772c48ba38))
- introduces PopConfirm component ([11819f5](https://github.com/gdi-be/mde-client/commit/11819f5cd69849a07531069b445461b68565293f))
- introduces Progess component ([930822b](https://github.com/gdi-be/mde-client/commit/930822b33cc6698aba1f1e89b6fed137c5dc02d5))
- introduces progress calculation ([500f805](https://github.com/gdi-be/mde-client/commit/500f8052e239cd366f12d4e90dc71fbed9033212))
- introduces server side rendering ([8dee98f](https://github.com/gdi-be/mde-client/commit/8dee98fe481e87463433998d12c72670668ae8c8))
- introduces smui and form fields ([e64c8e0](https://github.com/gdi-be/mde-client/commit/e64c8e08bc2e62b12f2ff33a7631b55306672629))
- introduces tabs to form ([a508592](https://github.com/gdi-be/mde-client/commit/a5085929aed4b80cde51d6d2f98701afcfca731e))
- introduces TagsInput ([543bfc8](https://github.com/gdi-be/mde-client/commit/543bfc898cd5d9ac80f91a6ae7b9cd0440c83793))
- introduces ValidationFeedbackText ([e004c8e](https://github.com/gdi-be/mde-client/commit/e004c8e2cd68339d22f8d21f61c88dd66c22734a))
- prepare AdditionalInformation field ([18b93c4](https://github.com/gdi-be/mde-client/commit/18b93c474fffc1dea487b3015f3a94b3b6f44e46))
- prepare AnnexThemeField ([b7f60b9](https://github.com/gdi-be/mde-client/commit/b7f60b98b3ba2ac72721286bdce3156bfb91cb88))
- prepare CommentsPanel ([2fa20ea](https://github.com/gdi-be/mde-client/commit/2fa20ea7b71b626ec335b061c571d20323fa9a1e))
- prepare ContentDescription fields ([f55897f](https://github.com/gdi-be/mde-client/commit/f55897f55b6b2d809dd9b6266b250b9f38499c33))
- prepare CRS fields ([9961b2f](https://github.com/gdi-be/mde-client/commit/9961b2f3de291e79e7141eeab45ecd1f9a2242e6))
- prepare DataProtectionField ([309fbc8](https://github.com/gdi-be/mde-client/commit/309fbc81858e381c192ed76f421638d1ceeaa568))
- prepare Lineage field ([66ebb98](https://github.com/gdi-be/mde-client/commit/66ebb98e7e6f99d33e260a0b654c554c3e4a42c9))
- prepare QualityReportCheckField ([b623d71](https://github.com/gdi-be/mde-client/commit/b623d71a1a5822349e104891d1434020d8e6fbc5))
- prepare Resolutin fields ([68e6730](https://github.com/gdi-be/mde-client/commit/68e67300843133472ca88935268b8a6ed0536682))
- prepare service form ([bce176a](https://github.com/gdi-be/mde-client/commit/bce176a12b8ff15cd4eb0b501c01ce4c04e25ff7))
- prepare status filter and chips ([ba35ce6](https://github.com/gdi-be/mde-client/commit/ba35ce6ab96e67270e6cbcea9ad4060b9ce2b955))
- prepare TechnicalDescription field ([d020a01](https://github.com/gdi-be/mde-client/commit/d020a010401a7fb38b9813888daf86d3c83ab4e1))
- prepare terms of use ([637d5cc](https://github.com/gdi-be/mde-client/commit/637d5cc1412c6d39a6b112cdc5f7e8190cda58c3))
- prepare TermsOfUseField ([815973a](https://github.com/gdi-be/mde-client/commit/815973a467e0162d408519d81679ff1eabe2145c))
- prepare ValidityRangeField ([d402552](https://github.com/gdi-be/mde-client/commit/d40255242f42162a69f89184bd18765e0b6a7d98))
- proxy for the search index interface ([a5c272e](https://github.com/gdi-be/mde-client/commit/a5c272e8dc36501a6f79a47cbfca642c96e01da2))
- reduce MetadatCard and add unassign code ([8613493](https://github.com/gdi-be/mde-client/commit/86134939e7104a423421287203dfea1b4f637c01))
- refactor form ([2f0c4eb](https://github.com/gdi-be/mde-client/commit/2f0c4ebf9de4e4922ee96cb58aaeb3f6ded1c7fe))
- refactor KeywordsField ([ff4cbd5](https://github.com/gdi-be/mde-client/commit/ff4cbd53b71ea3775cf5c9f33d8796000af6259a))
- refactor validation ([7132aff](https://github.com/gdi-be/mde-client/commit/7132aff65df4fabaca1bf20dde48c09122adffc9))
- selected status via searchParams ([de5edec](https://github.com/gdi-be/mde-client/commit/de5edec085d4007baf3e04bea41ad168c68f6cc4))
- this refactors the help to use static markdown files ([50c2d04](https://github.com/gdi-be/mde-client/commit/50c2d04de1c6776f581d20ae6719ec2abb3f08b8))
- transform searchfield into filterfield ([0d5e570](https://github.com/gdi-be/mde-client/commit/0d5e5707045617380c2ec69d24373b836673952e))
- update additionals tab ([b2ad94f](https://github.com/gdi-be/mde-client/commit/b2ad94f5cadc82cb4873d35e74e2f476c145ccd4))
- update help texts ([7724363](https://github.com/gdi-be/mde-client/commit/77243630e025667302fbd031d024e611b2808fb7))
- update metadata creation ([122aef0](https://github.com/gdi-be/mde-client/commit/122aef013c0a7921ed37bbd488746b2817e47793))
- update section tabs layout ([0d9b012](https://github.com/gdi-be/mde-client/commit/0d9b0127d397b9ccbc5ef6bc02921826e05e7d60))
- update tokens if needed ([a9cb3ee](https://github.com/gdi-be/mde-client/commit/a9cb3eeeba920c301b000ba273155a0e50e6bbaa))
- use findByMetadatId interfaces ([4ea4a54](https://github.com/gdi-be/mde-client/commit/4ea4a542012537787fc5bcffd3499cf9cd0f16e0))
- use fixed CRS options ([2b741b9](https://github.com/gdi-be/mde-client/commit/2b741b91f9c8bd2d7325c7cefefbf375171f70d7))
- use mounted codelist for terms of use ([516255a](https://github.com/gdi-be/mde-client/commit/516255a7edd6e0f13819a14a418e4210bbab6f23))
- use native datepicker ([65177c8](https://github.com/gdi-be/mde-client/commit/65177c840001b1661270b6e9dea628184558c78e))
- use Search and SearchPagination ([8cd71d5](https://github.com/gdi-be/mde-client/commit/8cd71d557121a289bce0a5d2f11804a6a98206a5))
- use TopicCategory for autofill example ([4a90447](https://github.com/gdi-be/mde-client/commit/4a90447552a248aee97bb3da8e0b90856a6423ac))
